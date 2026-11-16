from asyncpg import PostgresConnectionError
from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.exc import DBAPIError, InterfaceError, OperationalError
from starlette.exceptions import HTTPException

from connected_content.dtos.base import ErrorResponseDto, ValidationIssueDto
from connected_content.errors import ContentError, ErrorCode

_ERROR_DETAILS: dict[ErrorCode, tuple[int, str]] = {
    ErrorCode.UNAUTHENTICATED: (401, "Could not validate credentials"),
    ErrorCode.FORBIDDEN: (403, "Request forbidden"),
    ErrorCode.IDENTITY_UNAVAILABLE: (503, "Identity service is unavailable"),
    ErrorCode.SOCIAL_UNAVAILABLE: (503, "Social service is unavailable"),
    ErrorCode.DATABASE_UNAVAILABLE: (503, "Database is unavailable"),
    ErrorCode.PROFILE_NOT_FOUND: (404, "Profile not found"),
    ErrorCode.POST_NOT_FOUND: (404, "Post not found"),
    ErrorCode.VALIDATION_ERROR: (422, "Request validation failed"),
    ErrorCode.HTTP_ERROR: (400, "Request failed"),
    ErrorCode.INTERNAL_SERVER_ERROR: (500, "Internal server error"),
}


def content_error_response(
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


async def handle_content_error(_request: Request, exc: ContentError) -> JSONResponse:
    return content_error_response(exc.code)


async def handle_http_error(_request: Request, exc: HTTPException) -> JSONResponse:
    code = (
        ErrorCode.INTERNAL_SERVER_ERROR
        if exc.status_code >= 500
        else ErrorCode.HTTP_ERROR
    )
    response = content_error_response(code)
    response.status_code = exc.status_code
    response.headers.update(exc.headers or {})
    
    return response


async def handle_validation_error(
    _request: Request, exc: RequestValidationError
) -> JSONResponse:
    return content_error_response(
        ErrorCode.VALIDATION_ERROR,
        [
            ValidationIssueDto(
                location=list(issue["loc"]), code=issue["type"], message=issue["msg"]
            )
            for issue in exc.errors()
        ],
    )


async def handle_database_error(_request: Request, exc: DBAPIError) -> JSONResponse:
    state = getattr(exc.orig, "sqlstate", "") or ""
    unavailable = (
        exc.connection_invalidated
        or isinstance(exc, (OperationalError, InterfaceError))
        or state.startswith("08")
        or state in {"53300", "57P01", "57P02", "57P03"}
    )
    return content_error_response(
        ErrorCode.DATABASE_UNAVAILABLE
        if unavailable
        else ErrorCode.INTERNAL_SERVER_ERROR
    )


async def handle_database_unavailable(
    _request: Request, _exc: ConnectionError | TimeoutError | PostgresConnectionError
) -> JSONResponse:
    return content_error_response(ErrorCode.DATABASE_UNAVAILABLE)


async def handle_server_error(_request: Request, _exc: Exception) -> JSONResponse:
    return content_error_response(ErrorCode.INTERNAL_SERVER_ERROR)
