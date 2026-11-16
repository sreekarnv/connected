from fastapi import Request, Response
from starlette.middleware.base import RequestResponseEndpoint

SENSITIVE_AUTH_PATHS = {
    "/api/v1/auth/verify-email",
    "/api/v1/auth/forgot-password",
    "/api/v1/auth/verify-reset-token",
    "/api/v1/auth/reset-password",
}


def apply_sensitive_auth_headers(path: str, response: Response) -> Response:
    if path in SENSITIVE_AUTH_PATHS:
        response.headers["Cache-Control"] = "no-store"
        response.headers["Referrer-Policy"] = "no-referrer"
    return response


async def sensitive_auth_response_headers(
    request: Request, call_next: RequestResponseEndpoint
) -> Response:
    response = await call_next(request)
    return apply_sensitive_auth_headers(request.url.path, response)
