from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from faststream_fastapi import FastStreamAPI

from connected_identity.config.rabbitmq import start_broker, stop_broker
from connected_identity.config.settings import get_settings
from connected_identity.dtos.base import ErrorResponseDto
from connected_identity.errors import IdentityError
from connected_identity.exception_handlers import (
    handle_http_error,
    handle_identity_error,
    handle_server_error,
    handle_validation_error,
)
from connected_identity.middleware.security_headers import (
    sensitive_auth_response_headers,
)
from connected_identity.routers import api_v1, health, jwks
from connected_identity.services.token import get_signing_key

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    get_signing_key()
    await start_broker()
    try:
        yield
    finally:
        await stop_broker()


fastapi_app = FastAPI(
    title="Identity Service",
    lifespan=lifespan,
    responses={500: {"model": ErrorResponseDto}},
)
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type", "X-CSRF-Protection"],
)
fastapi_app.middleware("http")(sensitive_auth_response_headers)

app = FastStreamAPI(application=fastapi_app, safe_connection=True)

fastapi_app.exception_handler(IdentityError)(handle_identity_error)
fastapi_app.exception_handler(HTTPException)(handle_http_error)
fastapi_app.exception_handler(RequestValidationError)(handle_validation_error)
fastapi_app.exception_handler(Exception)(handle_server_error)

fastapi_app.include_router(health.router, prefix="/healthz", tags=["Health"])
fastapi_app.include_router(api_v1.router, prefix="/api/v1")
fastapi_app.include_router(jwks.router)
