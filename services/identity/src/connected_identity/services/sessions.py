import hashlib
import secrets
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta
from uuid import UUID, uuid4

from jwt.exceptions import InvalidTokenError
from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from connected_identity.db.schema import Credential, RefreshToken, User
from connected_identity.errors import ErrorCode, IdentityError
from connected_identity.services.password import verify_password
from connected_identity.services.token import create_access_token, decode_access_token

REFRESH_TOKEN_TTL = timedelta(days=30)


@dataclass(frozen=True)
class SessionTokens:
    access_token: str
    refresh_token: str
    expires_at: datetime


@dataclass(frozen=True)
class LoginResult:
    user: User
    tokens: SessionTokens


async def _issue_tokens(db: AsyncSession, user_id: UUID) -> SessionTokens:
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
    return SessionTokens(create_access_token(user_id), token, expires_at)


async def login(db: AsyncSession, *, email: str, password: str) -> LoginResult:
    try:
        user = await db.scalar(
            select(User)
            .where(func.lower(func.btrim(User.email)) == email.strip().lower())
            .with_for_update()
            .execution_options(populate_existing=True)
        )
        credential = (
            await db.scalar(
                select(Credential)
                .where(Credential.user_id == user.id)
                .execution_options(populate_existing=True)
            )
            if user is not None
            else None
        )
        valid = await verify_password(
            password, credential.password if credential is not None else None
        )
        if user is None or not valid:
            raise IdentityError(ErrorCode.INVALID_CREDENTIALS)
        if user.email_verified_at is None:
            raise IdentityError(ErrorCode.EMAIL_NOT_VERIFIED)
        tokens = await _issue_tokens(db, user.id)
        await db.commit()
        return LoginResult(user, tokens)
    except Exception:
        await db.rollback()
        raise


async def _lock_token(db: AsyncSession, token: str) -> RefreshToken | None:
    try:
        token_hash = hashlib.sha256(token.encode()).hexdigest()
    except UnicodeEncodeError:
        return None
    user_id = await db.scalar(
        select(RefreshToken.user_id).where(RefreshToken.token_hash == token_hash)
    )
    if user_id is None:
        return None
    await db.execute(
        select(User)
        .where(User.id == user_id)
        .with_for_update()
        .execution_options(populate_existing=True)
    )
    return await db.scalar(
        select(RefreshToken)
        .where(RefreshToken.token_hash == token_hash)
        .execution_options(populate_existing=True)
    )


async def refresh(db: AsyncSession, token: str) -> SessionTokens:
    try:
        previous = await _lock_token(db, token)
        now = datetime.now(UTC)
        if previous is None or previous.revoked_at or previous.expires_at <= now:
            raise IdentityError(ErrorCode.UNAUTHENTICATED)
        user = await db.get(User, previous.user_id)
        if user is None:
            raise IdentityError(ErrorCode.UNAUTHENTICATED)
        if user.email_verified_at is None:
            raise IdentityError(ErrorCode.EMAIL_NOT_VERIFIED)
        if previous.consumed_at is not None:
            await db.execute(
                update(RefreshToken)
                .where(RefreshToken.family_id == previous.family_id)
                .values(revoked_at=now)
            )
            await db.commit()
            raise IdentityError(ErrorCode.UNAUTHENTICATED)
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
        return SessionTokens(access_token, replacement, expires_at)
    except Exception:
        await db.rollback()
        raise


async def logout(db: AsyncSession, token: str | None) -> None:
    if token is None:
        return
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


async def get_verified_user(db: AsyncSession, access_token: str) -> User:
    try:
        user_id = decode_access_token(access_token)
    except (InvalidTokenError, ValueError, TypeError) as exc:
        raise IdentityError(ErrorCode.UNAUTHENTICATED) from exc
    user = await db.get(User, user_id)
    if user is None:
        raise IdentityError(ErrorCode.UNAUTHENTICATED)
    if user.email_verified_at is None:
        raise IdentityError(ErrorCode.EMAIL_NOT_VERIFIED)
    return user
