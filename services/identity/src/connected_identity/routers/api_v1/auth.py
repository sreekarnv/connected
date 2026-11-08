from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from connected_identity.config.types import DbSession
from connected_identity.db.schema import Credential, User
from connected_identity.dtos.api_v1.auth import (
    LoginRequestDto,
    LoginResponseDto,
    SignupRequestDto,
    UserDto,
)
from connected_identity.dtos.base import ErrorCode, ErrorResponseDto
from connected_identity.exceptions import ApiError
from connected_identity.middleware.protect_route import protect_route
from connected_identity.services.password import hash_password, verify_password
from connected_identity.services.token import create_access_token

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

    return UserDto.model_validate(user)


@router.post(
    "/login",
    operation_id="login",
    response_model=LoginResponseDto,
    responses={401: {"model": ErrorResponseDto}, 422: {"model": ErrorResponseDto}},
)
async def login(
    input: LoginRequestDto, db: AsyncSession = DbSession
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
    return LoginResponseDto(
        user=UserDto.model_validate(user), access_token=create_access_token(user.id)
    )


@router.get(
    "/me",
    operation_id="me",
    response_model=UserDto,
    responses={401: {"model": ErrorResponseDto}},
)
async def me(user: Annotated[User, Depends(protect_route)]) -> UserDto:
    return UserDto.model_validate(user)
