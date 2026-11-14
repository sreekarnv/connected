from datetime import datetime
from uuid import UUID

from sqlalchemy import delete, select, tuple_
from sqlalchemy.ext.asyncio import AsyncSession

from connected_content.db.schema import Post


async def create_post(db: AsyncSession, author_id: UUID, *, body: str) -> Post:
    try:
        post = Post(author_id=author_id, body=body)
        db.add(post)
        await db.commit()
        return post
    except Exception:
        await db.rollback()
        raise


async def get_post(db: AsyncSession, post_id: UUID) -> Post | None:
    post = await db.get(Post, post_id)
    db.expunge_all()
    await db.rollback()
    return post


async def list_posts(
    db: AsyncSession, *, after: tuple[datetime, UUID] | None, limit: int
) -> list[Post]:
    statement = select(Post)
    if after is not None:
        statement = statement.where(tuple_(Post.created_at, Post.id) < after)
    posts = list(
        await db.scalars(
            statement.order_by(Post.created_at.desc(), Post.id.desc()).limit(limit + 1)
        )
    )
    db.expunge_all()
    await db.rollback()
    return posts


async def delete_post(db: AsyncSession, actor_id: UUID, post_id: UUID) -> None:
    try:
        await db.execute(
            delete(Post).where(Post.id == post_id, Post.author_id == actor_id)
        )
        await db.commit()
    except Exception:
        await db.rollback()
        raise
