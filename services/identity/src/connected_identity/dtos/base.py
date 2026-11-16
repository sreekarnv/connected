from enum import Enum

from pydantic import BaseModel, Field

from connected_identity.errors import ErrorCode


class Status(Enum):
    Success = "success"
    Fail = "fail"
    Error = "error"


class ValidationIssueDto(BaseModel):
    location: list[str | int]
    code: str
    message: str


class ErrorResponseDto(BaseModel):
    code: ErrorCode
    message: str
    issues: list[ValidationIssueDto] = Field(default_factory=list)
