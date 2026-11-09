from fastapi import HTTPException, Request, status
from fastapi.exception_handlers import http_exception_handler
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, Response
from fastapi.utils import is_body_allowed_for_status_code

from connected_identity.dtos.base import ErrorResponseDto, ValidationIssueDto
from connected_identity.errors import ErrorCode, IdentityError
from connected_identity.middleware.security_headers import apply_sensitive_auth_headers

_ERROR_DETAILS: dict[ErrorCode, tuple[int, str]] = {
    ErrorCode.EMAIL_ALREADY_REGISTERED: (
        status.HTTP_409_CONFLICT,
        "Email is already registered",
    ),
    ErrorCode.EMAIL_NOT_VERIFIED: (
        status.HTTP_403_FORBIDDEN,
        "Verify your email before signing in",
    ),
    ErrorCode.INVALID_EMAIL_VERIFICATION_TOKEN: (
        status.HTTP_400_BAD_REQUEST,
        "Invalid or expired email verification token",
    ),
    ErrorCode.INVALID_CREDENTIALS: (
        status.HTTP_401_UNAUTHORIZED,
        "Incorrect email or password",
    ),
    ErrorCode.INVALID_PASSWORD_RESET_TOKEN: (
        status.HTTP_400_BAD_REQUEST,
        "Invalid or expired password reset token",
    ),
    ErrorCode.UNAUTHENTICATED: (
        status.HTTP_401_UNAUTHORIZED,
        "Could not validate credentials",
    ),
    ErrorCode.FORBIDDEN: (status.HTTP_403_FORBIDDEN, "Request forbidden"),
    ErrorCode.VALIDATION_ERROR: (
        status.HTTP_422_UNPROCESSABLE_CONTENT,
        "Request validation failed",
    ),
    ErrorCode.HTTP_ERROR: (status.HTTP_400_BAD_REQUEST, "Request failed"),
    ErrorCode.INTERNAL_SERVER_ERROR: (
        status.HTTP_500_INTERNAL_SERVER_ERROR,
        "Internal server error",
    ),
}


def identity_error_response(
    exc: IdentityError, issues: list[ValidationIssueDto] | None = None
) -> JSONResponse:
    status_code, message = _ERROR_DETAILS[exc.code]
    body = ErrorResponseDto(code=exc.code, message=message, issues=issues or [])
    headers = {"WWW-Authenticate": "Bearer"} if status_code == 401 else None
    return JSONResponse(
        body.model_dump(mode="json"), status_code=status_code, headers=headers
    )


async def handle_identity_error(_request: Request, exc: IdentityError) -> JSONResponse:
    return identity_error_response(exc)


async def handle_http_error(request: Request, exc: HTTPException) -> Response:
    if not is_body_allowed_for_status_code(exc.status_code):
        return await http_exception_handler(request, exc)
    if exc.status_code >= 500:
        body = ErrorResponseDto(
            code=ErrorCode.INTERNAL_SERVER_ERROR, message="Internal server error"
        )
    else:
        body = ErrorResponseDto(
            code=ErrorCode.HTTP_ERROR,
            message=exc.detail if isinstance(exc.detail, str) else "Request failed",
        )
    return JSONResponse(
        body.model_dump(mode="json"), status_code=exc.status_code, headers=exc.headers
    )


async def handle_validation_error(
    _request: Request, exc: RequestValidationError
) -> JSONResponse:
    return identity_error_response(
        IdentityError(ErrorCode.VALIDATION_ERROR),
        issues=[
            ValidationIssueDto(
                location=list(issue["loc"]), code=issue["type"], message=issue["msg"]
            )
            for issue in exc.errors()
        ],
    )


async def handle_server_error(request: Request, _exc: Exception) -> Response:
    body = ErrorResponseDto(
        code=ErrorCode.INTERNAL_SERVER_ERROR, message="Internal server error"
    )
    response = JSONResponse(
        body.model_dump(mode="json"), status_code=status.HTTP_500_INTERNAL_SERVER_ERROR
    )
    return apply_sensitive_auth_headers(request.url.path, response)
