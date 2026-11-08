from fastapi import APIRouter
from fastapi.responses import JSONResponse

from connected_identity.services.token import get_jwks

router = APIRouter()


@router.get("/.well-known/jwks.json")
async def jwks() -> JSONResponse:
    return JSONResponse(get_jwks(), headers={"Cache-Control": "public, max-age=300"})
