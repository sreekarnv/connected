import asyncio
from datetime import datetime
from typing import Annotated
from uuid import UUID

import httpx
from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel, ValidationError

from connected_social.config.settings import get_settings
from connected_social.db.connection import get_session
from connected_social.errors import ErrorCode, SocialError

settings = get_settings()
DbSession = Depends(get_session)
_bearer_scheme = HTTPBearer(auto_error=False)


class _IdentityActor(BaseModel):
    id: UUID
    email_verified_at: datetime


async def require_verified_actor(
    request: Request,
    credentials: Annotated[
        HTTPAuthorizationCredentials | None, Depends(_bearer_scheme)
    ],
) -> UUID:
    if credentials is None or not credentials.credentials.isascii():
        raise SocialError(ErrorCode.UNAUTHENTICATED)

    client: httpx.AsyncClient = request.app.state.identity_client
    upstream_request = httpx.Request(
        "GET",
        f"{settings.identity_url}/api/v1/auth/me",
        headers={"Authorization": f"Bearer {credentials.credentials}"},
    )
    
    try:
        async with asyncio.timeout(2):
            response = await client.send(upstream_request, stream=True)
            try:
                if response.status_code == 401:
                    raise SocialError(ErrorCode.UNAUTHENTICATED)
                elif response.status_code == 403:
                    raise SocialError(ErrorCode.FORBIDDEN)
                elif response.status_code != 200:
                    raise SocialError(ErrorCode.IDENTITY_UNAVAILABLE)
                
                
                actor = _IdentityActor.model_validate_json(
                    await response.aread(), strict=True
                )
                
                return actor.id
            finally:
                await response.aclose()
    except (httpx.HTTPError, TimeoutError, ValidationError):
        raise SocialError(ErrorCode.IDENTITY_UNAVAILABLE) from None
