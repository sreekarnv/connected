from typing import Annotated, Literal
from uuid import UUID

import httpx
from fastapi import APIRouter, Depends, Query, Request, status
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession

from connected_content.clients.social import (
    eligible_feed_author_ids,
    visible_profile_ids,
)
from connected_content.dependencies import (
    DbSession,
    VerifiedActor,
    require_verified_actor,
)
from connected_content.dtos.api_v1.posts import (
    CreatePostRequestDto,
    DeletePostResponseDto,
    PostCursor,
    PostDto,
    PostPageDto,
)
from connected_content.dtos.base import ErrorResponseDto
from connected_content.errors import ContentError, ErrorCode
from connected_content.services import posts

router = APIRouter(
    dependencies=[Depends(require_verified_actor)],
    responses={
        401: {"model": ErrorResponseDto},
        403: {"model": ErrorResponseDto},
        422: {"model": ErrorResponseDto},
        503: {"model": ErrorResponseDto},
    },
)
Actor = Annotated[VerifiedActor, Depends(require_verified_actor)]
PageLimit = Annotated[int, Query(ge=1, le=50)]
AfterCursor = Annotated[
    str | None, Query(min_length=1, max_length=512, pattern="^[A-Za-z0-9_-]+$")
]


@router.post(
    "",
    operation_id="contentCreatePost",
    response_model=PostDto,
    status_code=status.HTTP_201_CREATED,
    responses={404: {"model": ErrorResponseDto}},
)
async def create_post(
    input: CreatePostRequestDto,
    request: Request,
    actor: Actor,
    db: AsyncSession = DbSession,
) -> PostDto:
    client: httpx.AsyncClient = request.app.state.social_client
    if actor.id not in await visible_profile_ids(client, actor.bearer, {actor.id}):
        raise ContentError(ErrorCode.PROFILE_NOT_FOUND)
    return PostDto.model_validate(
        await posts.create_post(db, actor.id, body=input.body)
    )


async def _post_page(
    db: AsyncSession,
    client: httpx.AsyncClient,
    actor: VerifiedActor,
    *,
    limit: int,
    after: str | None,
    author_ids: set[UUID] | None,
    audience: Literal["visible", "following"],
) -> PostPageDto:
    cursor = None
    if after is not None:
        try:
            cursor = PostCursor.decode(after)
        except (ValueError, ValidationError):
            raise ContentError(ErrorCode.VALIDATION_ERROR) from None
    candidates = await posts.list_posts(
        db,
        after=(cursor.created_at, cursor.id) if cursor is not None else None,
        limit=limit,
        author_ids=author_ids,
    )
    examined = candidates[:limit]
    visible = set()
    if examined:
        lookup = (
            eligible_feed_author_ids if audience == "following" else visible_profile_ids
        )
        visible = await lookup(
            client, actor.bearer, {post.author_id for post in examined}
        )

    next_cursor = None
    if len(candidates) > limit:
        last = examined[-1]
        next_cursor = PostCursor(created_at=last.created_at, id=last.id).encode()

    return PostPageDto(
        items=[
            PostDto.model_validate(post)
            for post in examined
            if post.author_id in visible
        ],
        next_cursor=next_cursor,
    )


@router.get("", operation_id="contentPosts", response_model=PostPageDto)
async def list_posts(
    request: Request,
    actor: Actor,
    limit: PageLimit = 20,
    after: AfterCursor = None,
    author_ids: Annotated[list[UUID] | None, Query(min_length=1, max_length=50)] = None,
    db: AsyncSession = DbSession,
) -> PostPageDto:
    return await _post_page(
        db,
        request.app.state.social_client,
        actor,
        limit=limit,
        after=after,
        author_ids=set(author_ids) if author_ids is not None else None,
        audience="visible",
    )


@router.get("/feed", operation_id="contentFollowingPosts", response_model=PostPageDto)
async def following_posts(
    request: Request,
    actor: Actor,
    limit: PageLimit = 20,
    after: AfterCursor = None,
    db: AsyncSession = DbSession,
) -> PostPageDto:
    return await _post_page(
        db,
        request.app.state.social_client,
        actor,
        limit=limit,
        after=after,
        author_ids=None,
        audience="following",
    )


@router.get(
    "/{post_id}",
    operation_id="contentPost",
    response_model=PostDto,
    responses={404: {"model": ErrorResponseDto}},
)
async def get_post(
    post_id: UUID, request: Request, actor: Actor, db: AsyncSession = DbSession
) -> PostDto:
    post = await posts.get_post(db, post_id)
    if post is None:
        raise ContentError(ErrorCode.POST_NOT_FOUND)
    client: httpx.AsyncClient = request.app.state.social_client
    if post.author_id not in await visible_profile_ids(
        client, actor.bearer, {post.author_id}
    ):
        raise ContentError(ErrorCode.POST_NOT_FOUND)
    return PostDto.model_validate(post)


@router.delete(
    "/{post_id}", operation_id="contentDeletePost", response_model=DeletePostResponseDto
)
async def delete_post(
    post_id: UUID, actor: Actor, db: AsyncSession = DbSession
) -> DeletePostResponseDto:
    await posts.delete_post(db, actor.id, post_id)
    return DeletePostResponseDto()
