from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from connected_social.dependencies import DbSession, require_verified_actor
from connected_social.dtos.api_v1.profiles import ProfileDto
from connected_social.dtos.api_v1.relationships import (
    ProfilePageDto,
    RelationshipResultDto,
)
from connected_social.dtos.base import ErrorResponseDto
from connected_social.services import relationships

router = APIRouter(
    dependencies=[Depends(require_verified_actor)],
    responses={
        401: {"model": ErrorResponseDto},
        403: {"model": ErrorResponseDto},
        404: {"model": ErrorResponseDto},
        422: {"model": ErrorResponseDto},
        503: {"model": ErrorResponseDto},
    },
)
Actor = Annotated[UUID, Depends(require_verified_actor)]
PageLimit = Annotated[int, Query(ge=1, le=50)]


@router.put(
    "/following/{target_id}",
    operation_id="socialFollowProfile",
    response_model=RelationshipResultDto,
)
async def follow(
    target_id: UUID, actor_id: Actor, db: AsyncSession = DbSession
) -> RelationshipResultDto:
    await relationships.follow(db, actor_id, target_id)
    return RelationshipResultDto()


@router.delete(
    "/following/{target_id}",
    operation_id="socialUnfollowProfile",
    response_model=RelationshipResultDto,
)
async def unfollow(
    target_id: UUID, actor_id: Actor, db: AsyncSession = DbSession
) -> RelationshipResultDto:
    await relationships.unfollow(db, actor_id, target_id)
    return RelationshipResultDto()


@router.put(
    "/blocks/{target_id}",
    operation_id="socialBlockProfile",
    response_model=RelationshipResultDto,
)
async def block(
    target_id: UUID, actor_id: Actor, db: AsyncSession = DbSession
) -> RelationshipResultDto:
    await relationships.block(db, actor_id, target_id)
    return RelationshipResultDto()


@router.delete(
    "/blocks/{target_id}",
    operation_id="socialUnblockProfile",
    response_model=RelationshipResultDto,
)
async def unblock(
    target_id: UUID, actor_id: Actor, db: AsyncSession = DbSession
) -> RelationshipResultDto:
    await relationships.unblock(db, actor_id, target_id)
    return RelationshipResultDto()


@router.get(
    "/followers", operation_id="socialMyFollowers", response_model=ProfilePageDto
)
async def followers(
    actor_id: Actor,
    after: UUID | None = None,
    limit: PageLimit = 20,
    db: AsyncSession = DbSession,
) -> ProfilePageDto:
    items, cursor = await relationships.get_followers(
        db, actor_id, after=after, limit=limit
    )
    return ProfilePageDto(
        items=[ProfileDto.model_validate(profile) for profile in items],
        next_cursor=cursor,
    )


@router.get(
    "/following", operation_id="socialMyFollowing", response_model=ProfilePageDto
)
async def following(
    actor_id: Actor,
    after: UUID | None = None,
    limit: PageLimit = 20,
    db: AsyncSession = DbSession,
) -> ProfilePageDto:
    items, cursor = await relationships.get_following(
        db, actor_id, after=after, limit=limit
    )
    return ProfilePageDto(
        items=[ProfileDto.model_validate(profile) for profile in items],
        next_cursor=cursor,
    )


@router.get("/blocks", operation_id="socialMyBlocks", response_model=ProfilePageDto)
async def blocks(
    actor_id: Actor,
    after: UUID | None = None,
    limit: PageLimit = 20,
    db: AsyncSession = DbSession,
) -> ProfilePageDto:
    items, cursor = await relationships.get_blocks(
        db, actor_id, after=after, limit=limit
    )
    return ProfilePageDto(
        items=[ProfileDto.model_validate(profile) for profile in items],
        next_cursor=cursor,
    )
