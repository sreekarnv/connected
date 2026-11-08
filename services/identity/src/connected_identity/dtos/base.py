from enum import Enum, StrEnum
from typing import Literal

from pydantic import BaseModel, Field


class Status(Enum):
    Success = "success"
    Fail = "fail"
    Error = "error"


class ClientErrorCode(StrEnum):
    EMAIL_ALREADY_REGISTERED = "EMAIL_ALREADY_REGISTERED"
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS"
    UNAUTHENTICATED = "UNAUTHENTICATED"
    VALIDATION_ERROR = "VALIDATION_ERROR"
    HTTP_ERROR = "HTTP_ERROR"


type ServerErrorCode = Literal["INTERNAL_SERVER_ERROR"]


class ValidationIssueDto(BaseModel):
    location: list[str | int]
    code: str
    message: str


class ErrorDto[CodeT](BaseModel):
    code: CodeT
    message: str
    issues: list[ValidationIssueDto] = Field(default_factory=list)


class SuccessResponseDto[DataT](BaseModel):
    status: Literal["success"] = "success"
    data: DataT
    error: None = None


class FailResponseDto(BaseModel):
    status: Literal["fail"] = "fail"
    data: None = None
    error: ErrorDto[ClientErrorCode]


class ErrorResponseDto(BaseModel):
    status: Literal["error"] = "error"
    data: None = None
    error: ErrorDto[ServerErrorCode]
