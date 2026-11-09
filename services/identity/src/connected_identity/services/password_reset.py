import hashlib
import secrets
from datetime import UTC, datetime, timedelta

from sqlalchemy import delete, func, select, update
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from connected_identity.db.schema import (
    Credential,
    PasswordResetToken,
    RefreshToken,
    User,
)
from connected_identity.errors import ErrorCode, IdentityError
from connected_identity.services.password import hash_password

PASSWORD_RESET_TTL = timedelta(minutes=30)
PASSWORD_RESET_COOLDOWN = timedelta(seconds=60)


def _token_hash(token: str) -> str:
    try:
        return hashlib.sha256(token.encode()).hexdigest()
    except UnicodeEncodeError:
        raise IdentityError(ErrorCode.INVALID_PASSWORD_RESET_TOKEN) from None


async def request_password_reset(
    db: AsyncSession, email: str
) -> tuple[User, str] | None:
    try:
        user = await db.scalar(
            select(User)
            .where(func.lower(func.btrim(User.email)) == email.strip().lower())
            .with_for_update()
            .execution_options(populate_existing=True)
        )
        if (
            user is None
            or await db.scalar(
                select(Credential.user_id).where(Credential.user_id == user.id)
            )
            is None
        ):
            await db.rollback()
            return None

        now = datetime.now(UTC)
        previous = await db.get(PasswordResetToken, user.id, populate_existing=True)
        if previous is not None and now - previous.created_at < PASSWORD_RESET_COOLDOWN:
            await db.rollback()
            return None

        token = secrets.token_urlsafe(32)
        values = {
            "token_hash": _token_hash(token),
            "created_at": now,
            "expires_at": now + PASSWORD_RESET_TTL,
        }
        await db.execute(
            insert(PasswordResetToken)
            .values(user_id=user.id, **values)
            .on_conflict_do_update(
                index_elements=[PasswordResetToken.user_id], set_=values
            )
        )
        await db.commit()
        return user, token
    except Exception:
        await db.rollback()
        raise


async def verify_reset_token(db: AsyncSession, token: str) -> None:
    user_id = await db.scalar(
        select(PasswordResetToken.user_id).where(
            PasswordResetToken.token_hash == _token_hash(token),
            PasswordResetToken.expires_at > datetime.now(UTC),
        )
    )
    if user_id is None:
        raise IdentityError(ErrorCode.INVALID_PASSWORD_RESET_TOKEN)


async def reset_password(db: AsyncSession, token: str, password: str) -> None:
    invalid = IdentityError(ErrorCode.INVALID_PASSWORD_RESET_TOKEN)
    try:
        token_hash = _token_hash(token)
        user_id = await db.scalar(
            select(PasswordResetToken.user_id).where(
                PasswordResetToken.token_hash == token_hash,
                PasswordResetToken.expires_at > datetime.now(UTC),
            )
        )
        if user_id is None:
            raise invalid

        encoded = await hash_password(password)
        user = await db.scalar(
            select(User)
            .where(User.id == user_id)
            .with_for_update()
            .execution_options(populate_existing=True)
        )
        if user is None:
            raise invalid

        now = datetime.now(UTC)
        consumed = await db.scalar(
            delete(PasswordResetToken)
            .where(
                PasswordResetToken.user_id == user_id,
                PasswordResetToken.token_hash == token_hash,
                PasswordResetToken.expires_at > now,
            )
            .returning(PasswordResetToken.user_id)
        )
        if consumed is None:
            raise invalid

        changed = await db.scalar(
            update(Credential)
            .where(Credential.user_id == user_id)
            .values(password=encoded)
            .returning(Credential.user_id)
        )
        if changed is None:
            raise invalid
        await db.execute(
            update(RefreshToken)
            .where(RefreshToken.user_id == user_id)
            .values(revoked_at=now)
        )
        await db.commit()
    except Exception:
        await db.rollback()
        raise
