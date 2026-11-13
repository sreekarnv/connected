from fastapi import APIRouter

from connected_social.routers.api_v1.profiles import router as profiles_router

router = APIRouter()
router.include_router(profiles_router, prefix="/profiles", tags=["Profiles"])
