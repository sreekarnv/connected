import json
import logging
import sys
from datetime import UTC, datetime
from time import perf_counter

from fastapi import FastAPI, Response
from prometheus_client import (
    CONTENT_TYPE_LATEST,
    CollectorRegistry,
    Counter,
    Histogram,
    generate_latest,
)
from starlette.types import ASGIApp, Message, Receive, Scope, Send

SERVICE = "identity"

logger = logging.getLogger(f"connected_{SERVICE}")
registry = CollectorRegistry()

requests = Counter(
    "http_requests_total",
    "Completed HTTP requests",
    ["service", "method", "route", "status"],
    registry=registry,
)

duration = Histogram(
    "http_request_duration_seconds",
    "HTTP request duration in seconds",
    ["service", "method", "route"],
    registry=registry,
)


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        entry = {
            "timestamp": datetime.now(UTC).isoformat(),
            "level": record.levelname.lower(),
            "service": SERVICE,
            "event": record.getMessage(),
        }
        for key in (
            "method",
            "route",
            "status",
            "duration_seconds",
            "queue",
            "outcome",
        ):
            if hasattr(record, key):
                entry[key] = getattr(record, key)
        # Exceptions can contain SQL parameters, tokens or SMTP recipients.
        if record.exc_info and record.exc_info[0]:
            entry["error_type"] = record.exc_info[0].__name__
        return json.dumps(entry)


def configure_logging() -> None:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())
    logger.handlers = [handler]
    logger.setLevel(logging.INFO)
    logger.propagate = False

    # Default access logs contain raw paths and query strings.
    logging.getLogger("uvicorn.access").disabled = True
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.error").handlers = [handler]
    logging.getLogger("uvicorn.error").propagate = False


class RequestTelemetry:
    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http" or scope["path"] == "/metrics":
            await self.app(scope, receive, send)
            return
        start = perf_counter()
        status = 500

        async def capture(message: Message) -> None:
            nonlocal status
            if message["type"] == "http.response.start":
                status = message["status"]
            await send(message)

        try:
            await self.app(scope, receive, capture)
        finally:
            elapsed = perf_counter() - start
            route = getattr(scope.get("route"), "path", "unmatched")
            method = (
                scope["method"]
                if scope["method"]
                in {"GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
                else "OTHER"
            )
            requests.labels(SERVICE, method, route, str(status)).inc()
            duration.labels(SERVICE, method, route).observe(elapsed)
            logger.log(
                logging.ERROR if status >= 500 else logging.INFO,
                "http_request",
                extra={
                    "method": method,
                    "route": route,
                    "status": status,
                    "duration_seconds": elapsed,
                },
            )


def instrument(app: FastAPI) -> None:
    configure_logging()

    @app.get("/metrics", include_in_schema=False)
    async def metrics() -> Response:
        return Response(
            generate_latest(registry),
            headers={"Content-Type": CONTENT_TYPE_LATEST, "Cache-Control": "no-store"},
        )

    app.add_middleware(RequestTelemetry)


email_publications = Counter(
    "email_publications_total",
    "Pending email publication outcomes",
    ["service", "queue", "outcome"],
    registry=registry,
)
