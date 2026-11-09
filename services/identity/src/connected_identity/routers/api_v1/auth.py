from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends, Request, Response, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from connected_identity import jobs
from connected_identity.cookies import (
    clear_refresh_cookie,
    get_refresh_cookie,
    set_refresh_cookie,
)
from connected_identity.db.schema import User
from connected_identity.dependencies import (
    DbSession,
    require_csrf_protection,
    require_verified_user,
)
from connected_identity.dtos.api_v1.auth import (
    ForgotPasswordRequestDto,
    LoginRequestDto,
    LoginResponseDto,
    LogoutResponseDto,
    PasswordResetResponseDto,
    ResendVerificationResponseDto,
    ResetPasswordRequestDto,
    SignupRequestDto,
    TokenResponseDto,
    UserDto,
    VerifyEmailRequestDto,
    VerifyResetTokenRequestDto,
)
from connected_identity.dtos.base import ErrorResponseDto
from connected_identity.errors import ErrorCode, IdentityError
from connected_identity.exception_handlers import identity_error_response
from connected_identity.services import password_reset, registration, sessions

router = APIRouter()


@router.post(
    "/signup",
    operation_id="signup",
    response_model=UserDto,
    status_code=status.HTTP_201_CREATED,
    responses={409: {"model": ErrorResponseDto}, 422: {"model": ErrorResponseDto}},
)
async def signup(input: SignupRequestDto, db: AsyncSession = DbSession) -> UserDto:
    user = await registration.signup(
        db,
        name=input.name,
        email=input.email,
        password=input.password.get_secret_value(),
    )
    return UserDto.model_validate(user)


@router.post(
    "/verify-email",
    operation_id="verifyEmail",
    response_model=UserDto,
    responses={400: {"model": ErrorResponseDto}, 422: {"model": ErrorResponseDto}},
)
async def verify_email(
    input: VerifyEmailRequestDto, db: AsyncSession = DbSession
) -> UserDto:
    user = await registration.verify_email(db, input.token.get_secret_value())
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
    await registration.resend_verification(
        db, email=input.email, password=input.password.get_secret_value()
    )
    return ResendVerificationResponseDto()


@router.post(
    "/forgot-password",
    operation_id="forgotPassword",
    response_model=PasswordResetResponseDto,
    status_code=status.HTTP_202_ACCEPTED,
    dependencies=[Depends(require_csrf_protection)],
    responses={403: {"model": ErrorResponseDto}, 422: {"model": ErrorResponseDto}},
)
async def forgot_password(
    input: ForgotPasswordRequestDto, background: BackgroundTasks
) -> PasswordResetResponseDto:
    background.add_task(jobs.send_password_reset_email, str(input.email))
    return PasswordResetResponseDto()


@router.post(
    "/verify-reset-token",
    operation_id="verifyResetToken",
    response_model=PasswordResetResponseDto,
    dependencies=[Depends(require_csrf_protection)],
    responses={
        400: {"model": ErrorResponseDto},
        403: {"model": ErrorResponseDto},
        422: {"model": ErrorResponseDto},
    },
)
async def verify_reset_token(
    input: VerifyResetTokenRequestDto, db: AsyncSession = DbSession
) -> PasswordResetResponseDto:
    await password_reset.verify_reset_token(db, input.token.get_secret_value())
    return PasswordResetResponseDto()


@router.post(
    "/reset-password",
    operation_id="resetPassword",
    response_model=PasswordResetResponseDto,
    dependencies=[Depends(require_csrf_protection)],
    responses={
        400: {"model": ErrorResponseDto},
        403: {"model": ErrorResponseDto},
        422: {"model": ErrorResponseDto},
    },
)
async def reset_password(
    input: ResetPasswordRequestDto, response: Response, db: AsyncSession = DbSession
) -> PasswordResetResponseDto:
    await password_reset.reset_password(
        db, input.token.get_secret_value(), input.password.get_secret_value()
    )
    clear_refresh_cookie(response)
    return PasswordResetResponseDto()


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
    result = await sessions.login(
        db, email=input.email, password=input.password.get_secret_value()
    )
    set_refresh_cookie(response, result.tokens.refresh_token, result.tokens.expires_at)
    return LoginResponseDto(
        user=UserDto.model_validate(result.user),
        access_token=result.tokens.access_token,
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
) -> TokenResponseDto | JSONResponse:
    try:
        token = get_refresh_cookie(request)
        if token is None:
            raise IdentityError(ErrorCode.UNAUTHENTICATED)
        tokens = await sessions.refresh(db, token)
    except IdentityError as exc:
        if exc.code == ErrorCode.UNAUTHENTICATED:
            error_response = identity_error_response(exc)
            clear_refresh_cookie(error_response)
            return error_response
        raise
    set_refresh_cookie(response, tokens.refresh_token, tokens.expires_at)
    return TokenResponseDto(access_token=tokens.access_token)


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
    await sessions.logout(db, get_refresh_cookie(request))
    clear_refresh_cookie(response)
    return LogoutResponseDto()


@router.get(
    "/me",
    operation_id="me",
    response_model=UserDto,
    responses={401: {"model": ErrorResponseDto}, 403: {"model": ErrorResponseDto}},
)
async def me(user: Annotated[User, Depends(require_verified_user)]) -> UserDto:
    return UserDto.model_validate(user)
