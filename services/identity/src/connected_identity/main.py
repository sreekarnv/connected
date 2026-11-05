from fastapi import FastAPI

from connected_identity.routers import health

app = FastAPI(
    title="Identity Service"
)


app.include_router(health.router, prefix="/healthz", tags=["Health"])
