from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import httpx
from asyncpg import PostgresConnectionError
from fastapi import FastAPI, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import DBAPIError
from sqlalchemy.exc import TimeoutError as PoolTimeoutError
from starlette.exceptions import HTTPException
from starlette.middleware.base import RequestResponseEndpoint

from connected_content.config.settings import get_settings
from connected_content.db.connection import engine
from connected_content.dtos.base import ErrorResponseDto
from connected_content.errors import ContentError
from connected_content.exception_handlers import (
    handle_content_error,
    handle_database_error,
    handle_database_unavailable,
    handle_http_error,
    handle_server_error,
    handle_validation_error,
)
from connected_content.routers import api_v1, health


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    async with (
        httpx.AsyncClient(
            timeout=2,
            follow_redirects=False,
            transport=httpx.AsyncHTTPTransport(retries=0),
        ) as identity_client,
        httpx.AsyncClient(
            timeout=2,
            follow_redirects=False,
            transport=httpx.AsyncHTTPTransport(retries=0),
        ) as social_client,
    ):
        app.state.identity_client = identity_client
        app.state.social_client = social_client
        try:
            yield
        finally:
            await engine.dispose()


app = FastAPI(
    title="Content Service",
    lifespan=lifespan,
    responses={500: {"model": ErrorResponseDto}},
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_origins,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)


@app.middleware("http")
async def no_store(request: Request, call_next: RequestResponseEndpoint) -> Response:
    response = await call_next(request)
    response.headers["Cache-Control"] = "no-store"
    return response


app.exception_handler(ContentError)(handle_content_error)
app.exception_handler(HTTPException)(handle_http_error)
app.exception_handler(RequestValidationError)(handle_validation_error)
app.exception_handler(DBAPIError)(handle_database_error)
app.exception_handler(ConnectionError)(handle_database_unavailable)
app.exception_handler(TimeoutError)(handle_database_unavailable)
app.exception_handler(PoolTimeoutError)(handle_database_unavailable)
app.exception_handler(PostgresConnectionError)(handle_database_unavailable)
app.exception_handler(Exception)(handle_server_error)

app.include_router(health.router, prefix="/healthz", include_in_schema=False)
app.include_router(api_v1.router, prefix="/api/v1")
