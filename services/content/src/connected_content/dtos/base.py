from pydantic import BaseModel, Field

from connected_content.errors import ErrorCode


class ValidationIssueDto(BaseModel):
    location: list[str | int]
    code: str
    message: str


class ErrorResponseDto(BaseModel):
    code: ErrorCode
    message: str
    issues: list[ValidationIssueDto] = Field(default_factory=list)
