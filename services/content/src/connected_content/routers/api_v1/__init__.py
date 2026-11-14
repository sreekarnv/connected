from fastapi import APIRouter

from connected_content.routers.api_v1.posts import router as posts_router

router = APIRouter()
router.include_router(posts_router, prefix="/posts", tags=["Posts"])
