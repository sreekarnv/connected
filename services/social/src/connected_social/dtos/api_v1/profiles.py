from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

ProfileText = Annotated[str, Field(pattern=r"^[^\x00]*$")]


class CreateProfileRequestDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    handle: ProfileText = Field(min_length=1, max_length=30)
    display_name: ProfileText = Field(min_length=1, max_length=100)


class UpdateProfileRequestDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    display_name: ProfileText = Field(min_length=1, max_length=100)


class ProfileDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    handle: str
    display_name: str
    created_at: datetime
    updated_at: datetime
