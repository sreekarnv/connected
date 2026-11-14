import asyncio
from uuid import UUID

import httpx
from pydantic import BaseModel, TypeAdapter, ValidationError

from connected_content.config.settings import get_settings
from connected_content.errors import ContentError, ErrorCode


class _Profile(BaseModel):
    id: UUID


_profiles = TypeAdapter(list[_Profile])


async def visible_profile_ids(
    client: httpx.AsyncClient, bearer: str, ids: set[UUID]
) -> set[UUID]:
    upstream = httpx.Request(
        "GET",
        f"{get_settings().social_url}/api/v1/profiles/batch",
        params=[("ids", str(profile_id)) for profile_id in ids],
        headers={"Authorization": f"Bearer {bearer}"},
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
                    raise ContentError(ErrorCode.SOCIAL_UNAVAILABLE)
                profiles = _profiles.validate_json(await response.aread(), strict=True)
                returned = {profile.id for profile in profiles}
                if not returned <= ids:
                    raise ContentError(ErrorCode.SOCIAL_UNAVAILABLE)
                return returned
            finally:
                await response.aclose()
    except (httpx.HTTPError, TimeoutError, ValidationError):
        raise ContentError(ErrorCode.SOCIAL_UNAVAILABLE) from None
