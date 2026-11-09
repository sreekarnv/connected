from typing import Annotated

from fastapi import APIRouter, Depends, Request, Response, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from connected_identity.config.rabbitmq import broker, identity_events
from connected_identity.config.types import DbSession
from connected_identity.db.schema import Credential, User
from connected_identity.dtos.api_v1.auth import (
    LoginRequestDto,
    LoginResponseDto,
    LogoutResponseDto,
    SignupRequestDto,
    TokenResponseDto,
    UserDto,
)
from connected_identity.dtos.base import ErrorCode, ErrorResponseDto
from connected_identity.exceptions import ApiError
from connected_identity.middleware.csrf import require_csrf_protection
from connected_identity.middleware.protect_route import protect_route
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
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()

        constraint = getattr(
            getattr(exc.orig, "__cause__", None), "constraint_name", None
        )

        if constraint not in {"users_email_key", "ix_users_email_normalized"}:
            raise

        raise ApiError(ErrorCode.EMAIL_ALREADY_REGISTERED) from exc

    await broker.publish(
        {
            "user_id": str(user.id),
            "email": user.email,
            "name": user.name,
        },
        exchange=identity_events,
        routing_key="user.signup",
        persist=True,
    )

    return UserDto.model_validate(user)


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
    responses={401: {"model": ErrorResponseDto}},
)
async def me(user: Annotated[User, Depends(protect_route)]) -> UserDto:
    return UserDto.model_validate(user)
