from typing import Annotated

from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from connected_identity.config.settings import get_settings
from connected_identity.db.connection import get_session
from connected_identity.db.schema import User
from connected_identity.errors import ErrorCode, IdentityError
from connected_identity.services import sessions

DbSession = Depends(get_session)
_bearer_scheme = HTTPBearer(auto_error=False)


def require_csrf_protection(request: Request) -> None:
    if request.headers.getlist("X-CSRF-Protection") != ["1"] or any(
        origin not in get_settings().cors_origins
        for origin in request.headers.getlist("Origin")
    ):
        raise IdentityError(ErrorCode.FORBIDDEN)


async def require_verified_user(
    credentials: Annotated[
        HTTPAuthorizationCredentials | None, Depends(_bearer_scheme)
    ],
    db: AsyncSession = DbSession,
) -> User:
    if credentials is None:
        raise IdentityError(ErrorCode.UNAUTHENTICATED)
    return await sessions.get_verified_user(db, credentials.credentials)
