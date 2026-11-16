import asyncio

from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from connected_identity.db.connection import session_factory
from connected_identity.dtos.base import Status
from connected_identity.dtos.health import HealthResponseDto

router = APIRouter()


@router.get("/healthz/")
async def health_check():
    return HealthResponseDto(
        status=Status.Success, message="identity service is working as expected"
    )


@router.get("/livez", include_in_schema=False)
async def liveness():
    return {"status": "ok"}


@router.get("/readyz", include_in_schema=False)
async def readiness():
    try:
        async with asyncio.timeout(2), session_factory() as db:
            await db.execute(text("SELECT 1"))
    except (SQLAlchemyError, OSError, TimeoutError):
        raise HTTPException(status_code=503, detail="Database unavailable") from None
    return {"status": "ok"}
