import hashlib
import secrets
from datetime import UTC, datetime, timedelta
from uuid import UUID

from sqlalchemy import delete, func, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from connected_identity.db.schema import Credential, EmailVerificationToken, User
from connected_identity.errors import ErrorCode, IdentityError
from connected_identity.messaging.email import publish_verification_email
from connected_identity.services.password import hash_password, verify_password

EMAIL_VERIFICATION_TTL = timedelta(hours=24)
EMAIL_VERIFICATION_COOLDOWN = timedelta(seconds=60)


async def _issue_verification_token(db: AsyncSession, user_id: UUID) -> str:
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
    invalid = IdentityError(ErrorCode.INVALID_EMAIL_VERIFICATION_TOKEN)

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


async def signup(db: AsyncSession, *, name: str, email: str, password: str) -> User:
    encoded = await hash_password(password)
    user = User(name=name, email=email.strip().lower())
    try:
        db.add(user)
        await db.flush()
        db.add(Credential(password=encoded, user_id=user.id))
        token = await _issue_verification_token(db, user.id)
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        constraint = getattr(
            getattr(exc.orig, "__cause__", None), "constraint_name", None
        )
        if constraint not in {"users_email_key", "ix_users_email_normalized"}:
            raise
        raise IdentityError(ErrorCode.EMAIL_ALREADY_REGISTERED) from exc
    except Exception:
        await db.rollback()
        raise
    await publish_verification_email(user, token)
    return user


async def resend_verification(db: AsyncSession, *, email: str, password: str) -> None:
    try:
        result = await db.execute(
            select(User, Credential)
            .join(Credential, Credential.user_id == User.id)
            .where(func.lower(func.btrim(User.email)) == email.strip().lower())
        )
        account = result.one_or_none()
        valid = await verify_password(
            password, account[1].password if account is not None else None
        )
        if account is None or not valid:
            await db.rollback()
            return
        user = await db.scalar(
            select(User)
            .where(User.id == account[0].id)
            .with_for_update()
            .execution_options(populate_existing=True)
        )
        if user is None or user.email_verified_at is not None:
            await db.rollback()
            return
        previous = await db.get(EmailVerificationToken, user.id, populate_existing=True)
        if (
            previous is not None
            and datetime.now(UTC) - previous.created_at < EMAIL_VERIFICATION_COOLDOWN
        ):
            await db.rollback()
            return
        token = await _issue_verification_token(db, user.id)
        await db.commit()
    except Exception:
        await db.rollback()
        raise
    await publish_verification_email(user, token)
