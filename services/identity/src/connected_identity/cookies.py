from datetime import datetime

from fastapi import Request, Response

from connected_identity.config.settings import get_settings

_REFRESH_COOKIE_NAME = (
    "__Host-refresh_token" if get_settings().refresh_cookie_secure else "refresh_token"
)


def set_refresh_cookie(response: Response, token: str, expires_at: datetime) -> None:
    response.set_cookie(
        _REFRESH_COOKIE_NAME,
        token,
        expires=expires_at,
        path="/",
        secure=get_settings().refresh_cookie_secure,
        httponly=True,
        samesite="strict",
    )
    response.headers["Cache-Control"] = "no-store"


def clear_refresh_cookie(response: Response) -> None:
    response.delete_cookie(
        _REFRESH_COOKIE_NAME,
        path="/",
        secure=get_settings().refresh_cookie_secure,
        httponly=True,
        samesite="strict",
    )
    response.headers["Cache-Control"] = "no-store"


def get_refresh_cookie(request: Request) -> str | None:
    token = request.cookies.get(_REFRESH_COOKIE_NAME)
    return token if token is not None and 1 <= len(token) <= 1024 else None
