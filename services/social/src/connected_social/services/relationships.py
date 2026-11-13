from uuid import UUID

from sqlalchemy import Select, and_, delete, exists, or_, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import ColumnElement

from connected_social.db.schema import Block, Follow, Profile
from connected_social.errors import ErrorCode, SocialError


def visible_to(viewer_id: UUID) -> ColumnElement[bool]:
    return ~exists().where(
        or_(
            and_(Block.blocker_id == viewer_id, Block.blocked_id == Profile.id),
            and_(Block.blocker_id == Profile.id, Block.blocked_id == viewer_id),
        )
    ).correlate(Profile)


async def _lock_profiles(db: AsyncSession, actor_id: UUID, target_id: UUID) -> None:
    if actor_id == target_id:
        raise SocialError(ErrorCode.SELF_RELATIONSHIP)

    ids = list(
        await db.scalars(
            select(Profile.id)
            .where(Profile.id.in_([actor_id, target_id]))
            .order_by(Profile.id)
            .with_for_update()
        )
    )
    if len(ids) != 2:
        raise SocialError(ErrorCode.PROFILE_NOT_FOUND)


async def follow(db: AsyncSession, actor_id: UUID, target_id: UUID) -> None:
    try:
        await _lock_profiles(db, actor_id, target_id)
        target = await db.scalar(
            select(Profile.id).where(Profile.id == target_id, visible_to(actor_id))
        )
        if target is None:
            raise SocialError(ErrorCode.PROFILE_NOT_FOUND)
        await db.execute(
            insert(Follow)
            .values(follower_id=actor_id, followed_id=target_id)
            .on_conflict_do_nothing()
        )
        await db.commit()
    except Exception:
        await db.rollback()
        raise


async def unfollow(db: AsyncSession, actor_id: UUID, target_id: UUID) -> None:
    try:
        await _lock_profiles(db, actor_id, target_id)
        await db.execute(
            delete(Follow).where(
                Follow.follower_id == actor_id, Follow.followed_id == target_id
            )
        )
        await db.commit()
    except Exception:
        await db.rollback()
        raise


async def block(db: AsyncSession, actor_id: UUID, target_id: UUID) -> None:
    try:
        await _lock_profiles(db, actor_id, target_id)
        await db.execute(
            insert(Block)
            .values(blocker_id=actor_id, blocked_id=target_id)
            .on_conflict_do_nothing()
        )
        await db.execute(
            delete(Follow).where(
                or_(
                    and_(
                        Follow.follower_id == actor_id, Follow.followed_id == target_id
                    ),
                    and_(
                        Follow.follower_id == target_id, Follow.followed_id == actor_id
                    ),
                )
            )
        )
        await db.commit()
    except Exception:
        await db.rollback()
        raise


async def unblock(db: AsyncSession, actor_id: UUID, target_id: UUID) -> None:
    try:
        await _lock_profiles(db, actor_id, target_id)
        await db.execute(
            delete(Block).where(
                Block.blocker_id == actor_id, Block.blocked_id == target_id
            )
        )
        await db.commit()
    except Exception:
        await db.rollback()
        raise


async def _profile_page(
    db: AsyncSession,
    actor_id: UUID,
    statement: Select[Profile],
    *,
    after: UUID | None,
    limit: int,
) -> tuple[list[Profile], UUID | None]:
    if await db.get(Profile, actor_id) is None:
        raise SocialError(ErrorCode.PROFILE_NOT_FOUND)

    if after is not None:
        statement = statement.where(Profile.id > after)
    profiles = list(await db.scalars(statement.order_by(Profile.id).limit(limit + 1)))
    items = profiles[:limit]
    cursor = items[-1].id if len(profiles) > limit else None
    return items, cursor


async def get_followers(
    db: AsyncSession, actor_id: UUID, *, after: UUID | None, limit: int
) -> tuple[list[Profile], UUID | None]:
    return await _profile_page(
        db,
        actor_id,
        select(Profile)
        .join(Follow, Follow.follower_id == Profile.id)
        .where(Follow.followed_id == actor_id, visible_to(actor_id)),
        after=after,
        limit=limit,
    )


async def get_following(
    db: AsyncSession, actor_id: UUID, *, after: UUID | None, limit: int
) -> tuple[list[Profile], UUID | None]:
    return await _profile_page(
        db,
        actor_id,
        select(Profile)
        .join(Follow, Follow.followed_id == Profile.id)
        .where(Follow.follower_id == actor_id, visible_to(actor_id)),
        after=after,
        limit=limit,
    )


async def get_blocks(
    db: AsyncSession, actor_id: UUID, *, after: UUID | None, limit: int
) -> tuple[list[Profile], UUID | None]:
    return await _profile_page(
        db,
        actor_id,
        select(Profile)
        .join(Block, Block.blocked_id == Profile.id)
        .where(Block.blocker_id == actor_id),
        after=after,
        limit=limit,
    )
