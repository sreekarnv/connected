from uuid import UUID

from sqlalchemy import func, select, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from connected_social.db.schema import Profile
from connected_social.errors import ErrorCode, SocialError
from connected_social.services.relationships import visible_to


async def create_profile(
    db: AsyncSession, actor_id: UUID, *, handle: str, display_name: str
) -> tuple[Profile, bool]:
    try:
        profile = await db.scalar(
            insert(Profile)
            .values(id=actor_id, handle=handle, display_name=display_name)
            .on_conflict_do_nothing(index_elements=[Profile.id])
            .returning(Profile)
        )
        
        if profile is not None:
            await db.commit()
            return profile, True
        
        profile = await get_profile(db, actor_id)
        if profile.handle != handle:
            raise SocialError(ErrorCode.PROFILE_ALREADY_EXISTS)
        
        return profile, False
    except IntegrityError as exc:
        await db.rollback()

        constraint = getattr(
            getattr(exc.orig, "__cause__", None), "constraint_name", None
        )        
        if constraint != "uq_profiles_handle":
            raise

        profile = await db.get(Profile, actor_id)
        if profile is not None:
            if profile.handle != handle:
                raise SocialError(ErrorCode.PROFILE_ALREADY_EXISTS) from None
        
            return profile, False
        
        raise SocialError(ErrorCode.HANDLE_TAKEN) from None
    except Exception:
        await db.rollback()
        raise


async def get_profile(db: AsyncSession, profile_id: UUID) -> Profile:
    profile = await db.get(Profile, profile_id)
    
    if profile is None:
        raise SocialError(ErrorCode.PROFILE_NOT_FOUND)
    
    return profile


async def update_profile(
    db: AsyncSession, actor_id: UUID, *, display_name: str
) -> Profile:
    try:
        profile = await db.scalar(
            update(Profile)
            .where(Profile.id == actor_id)
            .values(display_name=display_name, updated_at=func.statement_timestamp())
            .returning(Profile)
        )
        
        if profile is None:
            raise SocialError(ErrorCode.PROFILE_NOT_FOUND)
        
        await db.commit()
        
        return profile
    except Exception:
        await db.rollback()
        raise


async def get_profile_by_handle(
    db: AsyncSession, viewer_id: UUID, handle: str
) -> Profile:
    profile = await db.scalar(
        select(Profile).where(Profile.handle == handle, visible_to(viewer_id))
    )
    
    if profile is None:
        raise SocialError(ErrorCode.PROFILE_NOT_FOUND)
    
    return profile


async def get_profiles_by_ids(
    db: AsyncSession, viewer_id: UUID, ids: list[UUID]
) -> list[Profile]:
    return list(
        await db.scalars(
            select(Profile).where(Profile.id.in_(set(ids)), visible_to(viewer_id))
        )
    )
