from enum import Enum, StrEnum

from pydantic import BaseModel, Field


class Status(Enum):
    Success = "success"
    Fail = "fail"
    Error = "error"


class ErrorCode(StrEnum):
    EMAIL_ALREADY_REGISTERED = "EMAIL_ALREADY_REGISTERED"
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS"
    UNAUTHENTICATED = "UNAUTHENTICATED"
    FORBIDDEN = "FORBIDDEN"
    VALIDATION_ERROR = "VALIDATION_ERROR"
    HTTP_ERROR = "HTTP_ERROR"
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR"


class ValidationIssueDto(BaseModel):
    location: list[str | int]
    code: str
    message: str


class ErrorResponseDto(BaseModel):
    code: ErrorCode
    message: str
    issues: list[ValidationIssueDto] = Field(default_factory=list)
