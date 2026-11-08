from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    SecretStr,
    StringConstraints,
    ValidationInfo,
    field_validator,
)

from connected_identity.dtos.base import SuccessResponseDto

Email = Annotated[EmailStr, Field(max_length=255)]
Password = Annotated[SecretStr, Field(min_length=6, max_length=128)]


class SignupRequestDto(BaseModel):
    name: Annotated[
        str, StringConstraints(strip_whitespace=True, min_length=1, max_length=255)
    ]
    email: Email
    password: Password
    password_confirm: Password

    @field_validator("password_confirm")
    @classmethod
    def passwords_match(cls, value: SecretStr, info: ValidationInfo) -> SecretStr:
        password = info.data.get("password")
        if password is not None and password != value:
            raise ValueError("Passwords do not match")
        return value


class LoginRequestDto(BaseModel):
    email: Email
    password: Password


class UserDto(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    email: EmailStr
    created_at: datetime
    updated_at: datetime


class LoginDataDto(BaseModel):
    user: UserDto
    access_token: str


class GetUserDataDto(BaseModel):
    user: UserDto


class UserResponseDto(SuccessResponseDto[UserDto]):
    pass


class LoginResponseDto(SuccessResponseDto[LoginDataDto]):
    pass


class GetUserResponseDto(SuccessResponseDto[GetUserDataDto]):
    pass
