from typing import Literal
from uuid import UUID

from pydantic import BaseModel

from connected_social.dtos.api_v1.profiles import ProfileDto


class RelationshipResultDto(BaseModel):
    status: Literal["success"] = "success"


class ProfilePageDto(BaseModel):
    items: list[ProfileDto]
    next_cursor: UUID | None
