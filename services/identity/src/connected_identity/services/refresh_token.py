import hashlib
import secrets
from datetime import UTC, datetime, timedelta
from uuid import UUID, uuid4

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from connected_identity.db.schema import RefreshToken
from connected_identity.dtos.base import ErrorCode
from connected_identity.exceptions import ApiError
from connected_identity.services.token import create_access_token

REFRESH_TOKEN_TTL = timedelta(days=30)


async def issue_tokens(db: AsyncSession, user_id: UUID) -> tuple[str, str, datetime]:
    try:
        token = secrets.token_urlsafe(32)
        family_id = uuid4()
        expires_at = datetime.now(UTC) + REFRESH_TOKEN_TTL
        db.add(
            RefreshToken(
                id=family_id,
                family_id=family_id,
                user_id=user_id,
                token_hash=hashlib.sha256(token.encode()).hexdigest(),
                expires_at=expires_at,
            )
        )
        access_token = create_access_token(user_id)
        await db.commit()
        return access_token, token, expires_at
    except Exception:
        await db.rollback()
        raise


async def _lock_token(db: AsyncSession, token: str) -> RefreshToken | None:
    try:
        token_hash = hashlib.sha256(token.encode()).hexdigest()
    except UnicodeEncodeError:
        return None
    family_id = await db.scalar(
        select(RefreshToken.family_id).where(RefreshToken.token_hash == token_hash)
    )
    if family_id is None:
        return None

    await db.execute(
        select(RefreshToken.id).where(RefreshToken.id == family_id).with_for_update()
    )
    return await db.scalar(
        select(RefreshToken)
        .where(RefreshToken.token_hash == token_hash)
        .execution_options(populate_existing=True)
    )


async def rotate_tokens(db: AsyncSession, token: str) -> tuple[str, str, datetime]:
    try:
        previous = await _lock_token(db, token)
        now = datetime.now(UTC)
        if previous is None or previous.revoked_at or previous.expires_at <= now:
            raise ApiError(ErrorCode.UNAUTHENTICATED)

        if previous.consumed_at is not None:
            await db.execute(
                update(RefreshToken)
                .where(RefreshToken.family_id == previous.family_id)
                .values(revoked_at=now)
            )
            await db.commit()
            raise ApiError(ErrorCode.UNAUTHENTICATED)

        replacement = secrets.token_urlsafe(32)
        expires_at = previous.expires_at
        previous.consumed_at = now
        db.add(
            RefreshToken(
                family_id=previous.family_id,
                user_id=previous.user_id,
                token_hash=hashlib.sha256(replacement.encode()).hexdigest(),
                expires_at=expires_at,
            )
        )
        access_token = create_access_token(previous.user_id)
        await db.commit()
        return access_token, replacement, expires_at
    except Exception:
        await db.rollback()
        raise


async def revoke_tokens(db: AsyncSession, token: str) -> None:
    try:
        previous = await _lock_token(db, token)
        if previous is not None:
            await db.execute(
                update(RefreshToken)
                .where(RefreshToken.family_id == previous.family_id)
                .values(revoked_at=datetime.now(UTC))
            )
        await db.commit()
    except Exception:
        await db.rollback()
        raise
