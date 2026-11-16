FROM ghcr.io/astral-sh/uv:python3.14-trixie-slim@sha256:e80c05a310400cfc90af00b5b7271ef9ad24816e3265e1162af8a678e1aad099 AS build

WORKDIR /app

ENV UV_LINK_MODE=copy UV_COMPILE_BYTECODE=1
COPY pyproject.toml uv.lock ./

RUN uv sync --locked --no-dev --group migration --no-install-project
COPY src ./src

RUN uv sync --locked --no-dev --group migration --no-editable

FROM ghcr.io/astral-sh/uv:python3.14-trixie-slim@sha256:e80c05a310400cfc90af00b5b7271ef9ad24816e3265e1162af8a678e1aad099 AS runtime

WORKDIR /app

ENV PATH="/app/.venv/bin:$PATH" PYTHONUNBUFFERED=1 ENVIRONMENT=production PORT=4003
RUN useradd --uid 10001 --create-home app
COPY --from=build /app/.venv ./.venv
COPY src/alembic ./src/alembic
COPY alembic.ini ./

USER 10001

EXPOSE 4003

CMD ["sh", "-c", "exec uvicorn connected_social.main:app --host 0.0.0.0 --port \"${PORT:-4003}\" --timeout-graceful-shutdown 30"]
