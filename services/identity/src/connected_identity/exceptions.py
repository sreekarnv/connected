from fastapi import HTTPException, status

from connected_identity.dtos.base import ErrorCode

_ERROR_DETAILS: dict[ErrorCode, tuple[int, str]] = {
    ErrorCode.EMAIL_ALREADY_REGISTERED: (
        status.HTTP_409_CONFLICT,
        "Email is already registered",
    ),
    ErrorCode.INVALID_CREDENTIALS: (
        status.HTTP_401_UNAUTHORIZED,
        "Incorrect email or password",
    ),
    ErrorCode.UNAUTHENTICATED: (
        status.HTTP_401_UNAUTHORIZED,
        "Could not validate credentials",
    ),
    ErrorCode.VALIDATION_ERROR: (
        status.HTTP_422_UNPROCESSABLE_CONTENT,
        "Request validation failed",
    ),
    ErrorCode.HTTP_ERROR: (status.HTTP_400_BAD_REQUEST, "Request failed"),
    ErrorCode.INTERNAL_SERVER_ERROR: (
        status.HTTP_500_INTERNAL_SERVER_ERROR,
        "Internal server error",
    ),
}


class ApiError(HTTPException):
    def __init__(self, code: ErrorCode) -> None:
        self.code = code
        status_code, message = _ERROR_DETAILS[code]
        headers = {"WWW-Authenticate": "Bearer"} if status_code == 401 else None
        super().__init__(status_code=status_code, detail=message, headers=headers)
