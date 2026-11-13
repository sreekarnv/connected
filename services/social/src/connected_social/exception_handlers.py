from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException

from connected_social.dtos.base import ErrorResponseDto, ValidationIssueDto
from connected_social.errors import ErrorCode, SocialError

_ERROR_DETAILS: dict[ErrorCode, tuple[int, str]] = {
    ErrorCode.UNAUTHENTICATED: (401, "Could not validate credentials"),
    ErrorCode.FORBIDDEN: (403, "Request forbidden"),
    ErrorCode.IDENTITY_UNAVAILABLE: (503, "Identity service is unavailable"),
    ErrorCode.DATABASE_UNAVAILABLE: (503, "Database is unavailable"),
    ErrorCode.PROFILE_NOT_FOUND: (404, "Profile not found"),
    ErrorCode.PROFILE_ALREADY_EXISTS: (409, "Profile already exists"),
    ErrorCode.HANDLE_TAKEN: (409, "Handle is already taken"),
    ErrorCode.VALIDATION_ERROR: (422, "Request validation failed"),
    ErrorCode.HTTP_ERROR: (400, "Request failed"),
    ErrorCode.INTERNAL_SERVER_ERROR: (500, "Internal server error"),
}


def social_error_response(
    code: ErrorCode, issues: list[ValidationIssueDto] | None = None
) -> JSONResponse:
    status_code, message = _ERROR_DETAILS[code]
    body = ErrorResponseDto(code=code, message=message, issues=issues or [])
    headers = {"Cache-Control": "no-store"}
    if status_code == 401:
        headers["WWW-Authenticate"] = "Bearer"
    return JSONResponse(
        body.model_dump(mode="json"), status_code=status_code, headers=headers
    )


async def handle_social_error(_request: Request, exc: SocialError) -> JSONResponse:
    return social_error_response(exc.code)


async def handle_http_error(_request: Request, exc: HTTPException) -> JSONResponse:
    code = (
        ErrorCode.INTERNAL_SERVER_ERROR
        if exc.status_code >= 500
        else ErrorCode.HTTP_ERROR
    )
    response = social_error_response(code)
    response.status_code = exc.status_code
    response.headers.update(exc.headers or {})
    return response


async def handle_validation_error(
    _request: Request, exc: RequestValidationError
) -> JSONResponse:
    return social_error_response(
        ErrorCode.VALIDATION_ERROR,
        [
            ValidationIssueDto(
                location=list(issue["loc"]), code=issue["type"], message=issue["msg"]
            )
            for issue in exc.errors()
        ],
    )


async def handle_server_error(_request: Request, _exc: Exception) -> JSONResponse:
    return social_error_response(ErrorCode.INTERNAL_SERVER_ERROR)
