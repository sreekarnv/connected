from typing import Annotated

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt.exceptions import InvalidTokenError
from sqlalchemy.ext.asyncio import AsyncSession

from connected_identity.config.types import DbSession
from connected_identity.db.schema import User
from connected_identity.dtos.base import ErrorCode
from connected_identity.exceptions import ApiError
from connected_identity.services.token import decode_access_token

_bearer_scheme = HTTPBearer(auto_error=False)


async def protect_route(
    credentials: Annotated[
        HTTPAuthorizationCredentials | None, Depends(_bearer_scheme)
    ],
    db: AsyncSession = DbSession,
) -> User:
    unauthorized = ApiError(ErrorCode.UNAUTHENTICATED)
    if credentials is None:
        raise unauthorized

    try:
        user_id = decode_access_token(credentials.credentials)
    except (InvalidTokenError, ValueError, TypeError) as exc:
        raise unauthorized from exc

    user = await db.get(User, user_id)
    if user is None:
        raise unauthorized

    return user
