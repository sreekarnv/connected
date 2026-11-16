import asyncio
from dataclasses import dataclass, field
from typing import Annotated
from uuid import UUID

import httpx
from fastapi import Depends, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import AwareDatetime, BaseModel, ValidationError

from connected_content.config.settings import get_settings
from connected_content.db.connection import get_session
from connected_content.errors import ContentError, ErrorCode

DbSession = Depends(get_session)
_bearer_scheme = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class VerifiedActor:
    id: UUID
    bearer: str = field(repr=False)


class _IdentityActor(BaseModel):
    id: UUID
    email_verified_at: AwareDatetime


async def require_verified_actor(
    request: Request,
    credentials: Annotated[
        HTTPAuthorizationCredentials | None, Depends(_bearer_scheme)
    ],
) -> VerifiedActor:
    if credentials is None or not credentials.credentials.isascii():
        raise ContentError(ErrorCode.UNAUTHENTICATED)

    client: httpx.AsyncClient = request.app.state.identity_client
    upstream = httpx.Request(
        "GET",
        f"{get_settings().identity_url}/api/v1/auth/me",
        headers={"Authorization": f"Bearer {credentials.credentials}"},
    )
    try:
        async with asyncio.timeout(2):
            response = await client.send(upstream, stream=True)
            try:
                if response.status_code == 401:
                    raise ContentError(ErrorCode.UNAUTHENTICATED)
                if response.status_code == 403:
                    raise ContentError(ErrorCode.FORBIDDEN)
                if response.status_code != 200:
                    raise ContentError(ErrorCode.IDENTITY_UNAVAILABLE)
                actor = _IdentityActor.model_validate_json(
                    await response.aread(), strict=True
                )
                return VerifiedActor(actor.id, credentials.credentials)
            finally:
                await response.aclose()
    except (httpx.HTTPError, TimeoutError, ValidationError):
        raise ContentError(ErrorCode.IDENTITY_UNAVAILABLE) from None
