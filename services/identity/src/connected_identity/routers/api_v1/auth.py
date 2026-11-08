from typing import Annotated

from fastapi import APIRouter, Depends, status
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from connected_identity.config.types import DbSession
from connected_identity.db.schema import Credential, User
from connected_identity.dtos.api_v1.auth import (
    GetUserDataDto,
    GetUserResponseDto,
    LoginDataDto,
    LoginRequestDto,
    LoginResponseDto,
    SignupRequestDto,
    UserDto,
    UserResponseDto,
)
from connected_identity.dtos.base import ClientErrorCode, FailResponseDto
from connected_identity.exceptions import ApiError
from connected_identity.middleware.protect_route import protect_route
from connected_identity.services.password import hash_password, verify_password
from connected_identity.services.token import create_access_token

router = APIRouter()


@router.post(
    "/signup",
    response_model=UserResponseDto,
    status_code=status.HTTP_201_CREATED,
    responses={409: {"model": FailResponseDto}, 422: {"model": FailResponseDto}},
)
async def signup(
    input: SignupRequestDto, db: AsyncSession = DbSession
) -> UserResponseDto:
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

        raise ApiError(ClientErrorCode.EMAIL_ALREADY_REGISTERED) from exc

    return UserResponseDto(data=UserDto.model_validate(user))


@router.post(
    "/login",
    response_model=LoginResponseDto,
    responses={401: {"model": FailResponseDto}, 422: {"model": FailResponseDto}},
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
        raise ApiError(ClientErrorCode.INVALID_CREDENTIALS)

    user = account[0]
    return LoginResponseDto(
        data=LoginDataDto(
            user=UserDto.model_validate(user), access_token=create_access_token(user.id)
        )
    )


@router.get(
    "/me",
    response_model=GetUserResponseDto,
    responses={401: {"model": FailResponseDto}},
)
async def me(user: Annotated[User, Depends(protect_route)]) -> GetUserResponseDto:
    return GetUserResponseDto(data=GetUserDataDto(user=UserDto.model_validate(user)))
