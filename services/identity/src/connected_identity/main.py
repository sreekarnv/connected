from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exception_handlers import http_exception_handler
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from fastapi.utils import is_body_allowed_for_status_code

from connected_identity.config.settings import get_settings
from connected_identity.dtos.base import (
    ErrorCode,
    ErrorResponseDto,
    ValidationIssueDto,
)
from connected_identity.exceptions import ApiError
from connected_identity.routers import api_v1, health, jwks
from connected_identity.services.token import get_signing_key


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    get_signing_key()
    yield


app = FastAPI(
    title="Identity Service",
    lifespan=lifespan,
    responses={500: {"model": ErrorResponseDto}},
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_origins,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)


def error_response(
    exc: HTTPException, issues: list[ValidationIssueDto] | None = None
) -> JSONResponse:
    if exc.status_code >= 500:
        body = ErrorResponseDto(
            code=ErrorCode.INTERNAL_SERVER_ERROR, message="Internal server error"
        )
    else:
        body = ErrorResponseDto(
            code=exc.code if isinstance(exc, ApiError) else ErrorCode.HTTP_ERROR,
            message=exc.detail if isinstance(exc.detail, str) else "Request failed",
            issues=issues or [],
        )

    return JSONResponse(
        body.model_dump(mode="json"), status_code=exc.status_code, headers=exc.headers
    )


@app.exception_handler(HTTPException)
async def handle_http_error(request: Request, exc: HTTPException) -> Response:
    if not is_body_allowed_for_status_code(exc.status_code):
        return await http_exception_handler(request, exc)

    return error_response(exc)


@app.exception_handler(RequestValidationError)
async def handle_validation_error(
    _request: Request, exc: RequestValidationError
) -> JSONResponse:
    return error_response(
        ApiError(ErrorCode.VALIDATION_ERROR),
        issues=[
            ValidationIssueDto(
                location=list(issue["loc"]), code=issue["type"], message=issue["msg"]
            )
            for issue in exc.errors()
        ],
    )


@app.exception_handler(Exception)
async def handle_server_error(_request: Request, _exc: Exception) -> JSONResponse:
    return error_response(HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR))


app.include_router(health.router, prefix="/healthz", tags=["Health"])
app.include_router(api_v1.router, prefix="/api/v1")
app.include_router(jwks.router)
