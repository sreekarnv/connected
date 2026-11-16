from fastapi import APIRouter

from connected_identity.routers.api_v1.auth import router as auth_router

router = APIRouter()


router.include_router(auth_router, prefix="/auth", tags=["Auth"])
