from datetime import UTC, datetime
from typing import Annotated
from urllib.parse import urlencode

from fastapi import APIRouter, Depends, Request, Response, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from connected_identity.config.rabbitmq import broker, identity_events
from connected_identity.config.settings import get_settings
from connected_identity.config.types import DbSession
from connected_identity.db.schema import Credential, EmailVerificationToken, User
from connected_identity.dtos.api_v1.auth import (
    LoginRequestDto,
    LoginResponseDto,
    LogoutResponseDto,
    ResendVerificationResponseDto,
    SignupRequestDto,
    TokenResponseDto,
    UserDto,
    VerifyEmailRequestDto,
)
from connected_identity.dtos.base import ErrorCode, ErrorResponseDto
from connected_identity.exceptions import ApiError
from connected_identity.middleware.csrf import require_csrf_protection
from connected_identity.middleware.protect_route import protect_route
from connected_identity.services.email_verification import (
    EMAIL_VERIFICATION_COOLDOWN,
    issue_verification_token,
)
from connected_identity.services.email_verification import (
    verify_email as consume_verification_token,
)
from connected_identity.services.password import hash_password, verify_password
from connected_identity.services.refresh_cookie import (
    clear_refresh_cookie,
    get_refresh_cookie,
    set_refresh_cookie,
)
from connected_identity.services.refresh_token import (
    issue_tokens,
    revoke_tokens,
    rotate_tokens,
)

router = APIRouter()


@router.post(
    "/signup",
    operation_id="signup",
    response_model=UserDto,
    status_code=status.HTTP_201_CREATED,
    responses={409: {"model": ErrorResponseDto}, 422: {"model": ErrorResponseDto}},
)
async def signup(input: SignupRequestDto, db: AsyncSession = DbSession) -> UserDto:
    password = await hash_password(input.password.get_secret_value())

    user = User(
        name=input.name,
        email=input.email.strip().lower(),
    )

    try:
        db.add(user)
        await db.flush()

        db.add(Credential(password=password, user_id=user.id))
        token = await issue_verification_token(db, user.id)
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()

        constraint = getattr(
            getattr(exc.orig, "__cause__", None), "constraint_name", None
        )

        if constraint not in {"users_email_key", "ix_users_email_normalized"}:
            raise

        raise ApiError(ErrorCode.EMAIL_ALREADY_REGISTERED) from exc

    await _publish_verification_email(user, token)

    return UserDto.model_validate(user)


async def _publish_verification_email(user: User, token: str) -> None:
    await broker.publish(
        {
            "user_id": str(user.id),
            "email": user.email,
            "name": user.name,
            "verification_url": (
                f"{get_settings().public_url}/api/v1/auth/verify-email"
                f"#{urlencode({'token': token})}"
            ),
        },
        exchange=identity_events,
        routing_key="user.signup",
        persist=True,
    )


@router.post(
    "/verify-email",
    operation_id="verifyEmail",
    response_model=UserDto,
    responses={400: {"model": ErrorResponseDto}, 422: {"model": ErrorResponseDto}},
)
async def verify_email(
    input: VerifyEmailRequestDto, db: AsyncSession = DbSession
) -> UserDto:
    user = await consume_verification_token(db, input.token.get_secret_value())
    return UserDto.model_validate(user)


@router.post(
    "/resend-verification",
    operation_id="resendVerification",
    response_model=ResendVerificationResponseDto,
    status_code=status.HTTP_202_ACCEPTED,
    dependencies=[Depends(require_csrf_protection)],
    responses={403: {"model": ErrorResponseDto}, 422: {"model": ErrorResponseDto}},
)
async def resend_verification(
    input: LoginRequestDto, db: AsyncSession = DbSession
) -> ResendVerificationResponseDto:
    result = await db.execute(
        select(User, Credential)
        .join(Credential, Credential.user_id == User.id)
        .where(func.lower(func.btrim(User.email)) == input.email.strip().lower())
    )
    account = result.one_or_none()
    valid = await verify_password(
        input.password.get_secret_value(),
        account[1].password if account is not None else None,
    )
    if account is None or not valid:
        return ResendVerificationResponseDto()
    try:
        user = await db.scalar(
            select(User)
            .where(User.id == account[0].id)
            .with_for_update()
            .execution_options(populate_existing=True)
        )
        if user is None or user.email_verified_at is not None:
            await db.rollback()
            return ResendVerificationResponseDto()
        previous = await db.get(EmailVerificationToken, user.id, populate_existing=True)
        if (
            previous is not None
            and datetime.now(UTC) - previous.created_at < EMAIL_VERIFICATION_COOLDOWN
        ):
            await db.rollback()
            return ResendVerificationResponseDto()
        token = await issue_verification_token(db, user.id)
        await db.commit()
    except Exception:
        await db.rollback()
        raise
    await _publish_verification_email(user, token)
    return ResendVerificationResponseDto()


@router.post(
    "/login",
    operation_id="login",
    response_model=LoginResponseDto,
    dependencies=[Depends(require_csrf_protection)],
    responses={
        401: {"model": ErrorResponseDto},
        403: {"model": ErrorResponseDto},
        422: {"model": ErrorResponseDto},
    },
)
async def login(
    input: LoginRequestDto, response: Response, db: AsyncSession = DbSession
) -> LoginResponseDto:
    result = await db.execute(
        select(User, Credential)
        .join(Credential, Credential.user_id == User.id)
        .where(func.lower(func.btrim(User.email)) == input.email.strip().lower())
    )
    account = result.one_or_none()

    valid = await verify_password(
        input.password.get_secret_value(),
        account[1].password if account is not None else None,
    )

    if account is None or not valid:
        raise ApiError(ErrorCode.INVALID_CREDENTIALS)

    user = account[0]
    if user.email_verified_at is None:
        raise ApiError(ErrorCode.EMAIL_NOT_VERIFIED)
    access_token, refresh_token, expires_at = await issue_tokens(db, user.id)
    set_refresh_cookie(response, refresh_token, expires_at)

    return LoginResponseDto(
        user=UserDto.model_validate(user),
        access_token=access_token,
    )


@router.post(
    "/refresh",
    operation_id="refresh",
    response_model=TokenResponseDto,
    dependencies=[Depends(require_csrf_protection)],
    responses={401: {"model": ErrorResponseDto}, 403: {"model": ErrorResponseDto}},
)
async def refresh(
    request: Request, response: Response, db: AsyncSession = DbSession
) -> TokenResponseDto:
    try:
        token = get_refresh_cookie(request)
        if token is None:
            raise ApiError(ErrorCode.UNAUTHENTICATED)
        access_token, refresh_token, expires_at = await rotate_tokens(db, token)
    except ApiError as exc:
        if exc.status_code == status.HTTP_401_UNAUTHORIZED:
            clear_refresh_cookie(response)
            exc.headers = {
                **(exc.headers or {}),
                "Set-Cookie": response.headers["Set-Cookie"],
                "Cache-Control": "no-store",
            }
        raise

    set_refresh_cookie(response, refresh_token, expires_at)

    return TokenResponseDto(access_token=access_token)


@router.post(
    "/logout",
    operation_id="logout",
    response_model=LogoutResponseDto,
    dependencies=[Depends(require_csrf_protection)],
    responses={403: {"model": ErrorResponseDto}},
)
async def logout(
    request: Request, response: Response, db: AsyncSession = DbSession
) -> LogoutResponseDto:
    token = get_refresh_cookie(request)
    if token is not None:
        await revoke_tokens(db, token)

    clear_refresh_cookie(response)

    return LogoutResponseDto()


@router.get(
    "/me",
    operation_id="me",
    response_model=UserDto,
    responses={401: {"model": ErrorResponseDto}, 403: {"model": ErrorResponseDto}},
)
async def me(user: Annotated[User, Depends(protect_route)]) -> UserDto:
    return UserDto.model_validate(user)
