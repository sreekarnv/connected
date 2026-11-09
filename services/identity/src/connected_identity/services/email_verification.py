import hashlib
import secrets
from datetime import UTC, datetime, timedelta
from uuid import UUID

from sqlalchemy import delete, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from connected_identity.db.schema import EmailVerificationToken, User
from connected_identity.dtos.base import ErrorCode
from connected_identity.exceptions import ApiError

EMAIL_VERIFICATION_TTL = timedelta(hours=24)
EMAIL_VERIFICATION_COOLDOWN = timedelta(seconds=60)


async def issue_verification_token(db: AsyncSession, user_id: UUID) -> str:
    token = secrets.token_urlsafe(32)
    now = datetime.now(UTC)

    values = {
        "token_hash": hashlib.sha256(token.encode()).hexdigest(),
        "created_at": now,
        "expires_at": now + EMAIL_VERIFICATION_TTL,
    }

    await db.execute(
        insert(EmailVerificationToken)
        .values(user_id=user_id, **values)
        .on_conflict_do_update(
            index_elements=[EmailVerificationToken.user_id], set_=values
        )
    )

    return token


async def verify_email(db: AsyncSession, token: str) -> User:
    invalid = ApiError(ErrorCode.INVALID_EMAIL_VERIFICATION_TOKEN)

    try:
        try:
            token_hash = hashlib.sha256(token.encode()).hexdigest()
        except UnicodeEncodeError:
            raise invalid from None

        user_id = await db.scalar(
            select(EmailVerificationToken.user_id).where(
                EmailVerificationToken.token_hash == token_hash
            )
        )

        if user_id is None:
            raise invalid

        user = await db.scalar(
            select(User)
            .where(User.id == user_id)
            .with_for_update()
            .execution_options(populate_existing=True)
        )

        if user is None or user.email_verified_at is not None:
            raise invalid

        now = datetime.now(UTC)
        consumed = await db.scalar(
            delete(EmailVerificationToken)
            .where(
                EmailVerificationToken.user_id == user_id,
                EmailVerificationToken.token_hash == token_hash,
                EmailVerificationToken.expires_at > now,
            )
            .returning(EmailVerificationToken.user_id)
        )

        if consumed is None:
            raise invalid

        user.email_verified_at = now

        await db.commit()
        await db.refresh(user)

        return user
    except Exception:
        await db.rollback()
        raise
