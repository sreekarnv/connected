from fastapi import APIRouter

from connected_identity.dtos.base import Status
from connected_identity.dtos.health import HealthResponseDto

router = APIRouter()


@router.get("/")
async def health_check():
    return HealthResponseDto(
        status=Status.Success, message="identity service is working as expected"
    )
