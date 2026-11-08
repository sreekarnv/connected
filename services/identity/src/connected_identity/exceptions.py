from fastapi import HTTPException, status

from connected_identity.dtos.base import ClientErrorCode

_ERROR_DETAILS: dict[ClientErrorCode, tuple[int, str]] = {
    ClientErrorCode.EMAIL_ALREADY_REGISTERED: (
        status.HTTP_409_CONFLICT,
        "Email is already registered",
    ),
    ClientErrorCode.INVALID_CREDENTIALS: (
        status.HTTP_401_UNAUTHORIZED,
        "Incorrect email or password",
    ),
    ClientErrorCode.UNAUTHENTICATED: (
        status.HTTP_401_UNAUTHORIZED,
        "Could not validate credentials",
    ),
    ClientErrorCode.VALIDATION_ERROR: (
        status.HTTP_422_UNPROCESSABLE_CONTENT,
        "Request validation failed",
    ),
    ClientErrorCode.HTTP_ERROR: (status.HTTP_400_BAD_REQUEST, "Request failed"),
}


class ApiError(HTTPException):
    def __init__(self, code: ClientErrorCode) -> None:
        self.code = code
        status_code, message = _ERROR_DETAILS[code]
        headers = {"WWW-Authenticate": "Bearer"} if status_code == 401 else None
        super().__init__(status_code=status_code, detail=message, headers=headers)
