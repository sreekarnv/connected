from typing import Literal

from fastapi import APIRouter
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from connected_content.dependencies import DbSession
from connected_content.dtos.base import ErrorResponseDto

router = APIRouter()


@router.get("/", responses={503: {"model": ErrorResponseDto}})
async def health_check(db: AsyncSession = DbSession) -> dict[str, Literal["success"]]:
    await db.scalar(text("SELECT 1"))
    return {"status": "success"}
