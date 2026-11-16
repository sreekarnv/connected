from pydantic import BaseModel

from connected_identity.dtos.base import Status


class HealthResponseDto(BaseModel):
    status: Status
    message: str
