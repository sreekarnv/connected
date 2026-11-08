from fastapi import Request

from connected_identity.config.settings import get_settings
from connected_identity.dtos.base import ErrorCode
from connected_identity.exceptions import ApiError


def require_csrf_protection(request: Request) -> None:
    if request.headers.getlist("X-CSRF-Protection") != ["1"] or any(
        origin not in get_settings().cors_origins
        for origin in request.headers.getlist("Origin")
    ):
        raise ApiError(ErrorCode.FORBIDDEN)
