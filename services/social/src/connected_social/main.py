from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException
from starlette.middleware.base import RequestResponseEndpoint

from connected_social.config.settings import get_settings
from connected_social.db.connection import engine
from connected_social.dtos.base import ErrorResponseDto
from connected_social.errors import SocialError
from connected_social.exception_handlers import (
    handle_http_error,
    handle_server_error,
    handle_social_error,
    handle_validation_error,
)
from connected_social.routers import api_v1, health


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    async with httpx.AsyncClient(
        timeout=2, follow_redirects=False, transport=httpx.AsyncHTTPTransport(retries=0)
    ) as client:
        app.state.identity_client = client
        try:
            yield
        finally:
            await engine.dispose()


app = FastAPI(
    title="Social Service",
    lifespan=lifespan,
    responses={500: {"model": ErrorResponseDto}},
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_origins,
    allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.middleware("http")
async def no_store(request: Request, call_next: RequestResponseEndpoint) -> Response:
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-store"
    return response


app.exception_handler(SocialError)(handle_social_error)
app.exception_handler(HTTPException)(handle_http_error)
app.exception_handler(RequestValidationError)(handle_validation_error)
app.exception_handler(Exception)(handle_server_error)
app.include_router(health.router, prefix="/healthz", include_in_schema=False)
app.include_router(api_v1.router, prefix="/api/v1")
