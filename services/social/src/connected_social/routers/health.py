import asyncio
from typing import Literal

from asyncpg import PostgresError
from fastapi import APIRouter
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from connected_social.dependencies import DbSession
from connected_social.dtos.base import ErrorResponseDto
from connected_social.errors import ErrorCode, SocialError

router = APIRouter()


async def liveness() -> dict[str, Literal["success"]]:
    return {"status": "success"}


@router.get("/", responses={503: {"model": ErrorResponseDto}})
async def health_check(db: AsyncSession = DbSession) -> dict[str, Literal["success"]]:
    try:
        async with asyncio.timeout(2):
            await db.scalar(text("SELECT 1"))
    except (SQLAlchemyError, PostgresError, OSError, TimeoutError):
        raise SocialError(ErrorCode.DATABASE_UNAVAILABLE) from None
    return {"status": "success"}
