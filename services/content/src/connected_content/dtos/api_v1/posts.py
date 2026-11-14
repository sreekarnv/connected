import base64
from datetime import UTC
from typing import Literal
from uuid import UUID

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field, field_validator


class CreatePostRequestDto(BaseModel):
    model_config = ConfigDict(extra="forbid")

    body: str = Field(min_length=1, max_length=5000)

    @field_validator("body")
    @classmethod
    def valid_body(cls, value: str) -> str:
        if not value.strip() or "\x00" in value:
            raise ValueError("Body must contain text and no NUL characters")
        return value


class PostDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    author_id: UUID
    body: str
    created_at: AwareDatetime


class PostPageDto(BaseModel):
    items: list[PostDto]
    next_cursor: str | None


class DeletePostResponseDto(BaseModel):
    status: Literal["success"] = "success"


class PostCursor(BaseModel):
    model_config = ConfigDict(extra="forbid")

    created_at: AwareDatetime
    id: UUID

    @field_validator("created_at")
    @classmethod
    def utc_timestamp(cls, value: AwareDatetime) -> AwareDatetime:
        try:
            return value.astimezone(UTC)
        except OverflowError:
            raise ValueError(
                "Cursor timestamp is outside the supported range"
            ) from None

    @classmethod
    def decode(cls, value: str) -> "PostCursor":
        data = base64.b64decode(
            value + "=" * (-len(value) % 4), altchars=b"-_", validate=True
        )
        return cls.model_validate_json(data, strict=True)

    def encode(self) -> str:
        return (
            base64.urlsafe_b64encode(self.model_dump_json().encode())
            .decode()
            .rstrip("=")
        )
