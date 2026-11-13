from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status
from sqlalchemy.ext.asyncio import AsyncSession

from connected_social.dependencies import DbSession, require_verified_actor
from connected_social.dtos.api_v1.profiles import (
    CreateProfileRequestDto,
    ProfileDto,
    UpdateProfileRequestDto,
)
from connected_social.dtos.base import ErrorResponseDto
from connected_social.services import profiles

router = APIRouter(
    dependencies=[Depends(require_verified_actor)],
    responses={
        401: {"model": ErrorResponseDto},
        403: {"model": ErrorResponseDto},
        422: {"model": ErrorResponseDto},
        503: {"model": ErrorResponseDto},
    },
)
Actor = Annotated[UUID, Depends(require_verified_actor)]


@router.post(
    "/me",
    operation_id="socialCreateMyProfile",
    response_model=ProfileDto,
    status_code=status.HTTP_201_CREATED,
    responses={200: {"model": ProfileDto}, 409: {"model": ErrorResponseDto}},
)
async def create_my_profile(
    input: CreateProfileRequestDto,
    response: Response,
    actor_id: Actor,
    db: AsyncSession = DbSession,
) -> ProfileDto:
    profile, created = await profiles.create_profile(
        db, actor_id, handle=input.handle, display_name=input.display_name
    )
    response.status_code = 201 if created else 200
    
    return ProfileDto.model_validate(profile)


@router.get(
    "/me",
    operation_id="socialMyProfile",
    response_model=ProfileDto,
    responses={404: {"model": ErrorResponseDto}},
)
async def my_profile(actor_id: Actor, db: AsyncSession = DbSession) -> ProfileDto:
    return ProfileDto.model_validate(await profiles.get_profile(db, actor_id))


@router.patch(
    "/me",
    operation_id="socialUpdateMyProfile",
    response_model=ProfileDto,
    responses={404: {"model": ErrorResponseDto}},
)
async def update_my_profile(
    input: UpdateProfileRequestDto, actor_id: Actor, db: AsyncSession = DbSession
) -> ProfileDto:
    return ProfileDto.model_validate(
        await profiles.update_profile(db, actor_id, display_name=input.display_name)
    )


@router.get(
    "/by-handle",
    operation_id="socialProfileByHandle",
    response_model=ProfileDto,
    responses={404: {"model": ErrorResponseDto}},
)
async def profile_by_handle(
    handle: Annotated[str, Query(min_length=1, max_length=30)],
    db: AsyncSession = DbSession,
) -> ProfileDto:
    return ProfileDto.model_validate(await profiles.get_profile_by_handle(db, handle))


@router.get(
    "/batch", operation_id="socialProfilesByIds", response_model=list[ProfileDto]
)
async def profiles_by_ids(
    ids: Annotated[list[UUID], Query(min_length=1, max_length=50)],
    db: AsyncSession = DbSession,
) -> list[ProfileDto]:
    return [
        ProfileDto.model_validate(profile)
        for profile in await profiles.get_profiles_by_ids(db, ids)
    ]
