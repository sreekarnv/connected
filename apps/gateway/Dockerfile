FROM ghcr.io/astral-sh/uv:python3.14-trixie-slim@sha256:e80c05a310400cfc90af00b5b7271ef9ad24816e3265e1162af8a678e1aad099 AS contracts

WORKDIR /repo

ENV UV_LINK_MODE=copy

COPY <<'PY' /tmp/export-openapi.py
"""Export contracts with fixture-only settings, without starting any service."""

import argparse
import importlib
import json
import sys
from pathlib import Path


def export(service: str, destination: Path) -> None:
    def block_network(event: str, args: tuple) -> None:
        if event in {"socket.connect", "socket.getaddrinfo"}:
            raise RuntimeError("OpenAPI export must not make network connections")
        if event == "open" and isinstance(args[0], (str, bytes)):
            name = Path(
                args[0].decode() if isinstance(args[0], bytes) else args[0]
            ).name
            if name == ".env" or name.startswith(".env."):
                raise RuntimeError("OpenAPI export must not read dotenv files")

    sys.addaudithook(block_network)
    settings_module = importlib.import_module(f"connected_{service}.config.settings")

    class OfflineSettings(settings_module.Settings):
        @classmethod
        def settings_customise_sources(
            cls,
            settings_cls,
            init_settings,
            env_settings,
            dotenv_settings,
            file_secret_settings,
        ):
            # Only explicit fixtures: ignore ambient environment, .env and secret files.
            return (init_settings,)

    fixtures = {
        "environment": "development",
        "database_url": "postgresql+asyncpg://schema:schema@localhost:5432/schema",
        "rabbitmq_url": "amqp://schema:schema@localhost:5672/",
        "public_url": "http://localhost:4001",
        "web_url": "http://localhost:3000",
        "identity_url": "http://localhost:4001",
        "social_url": "http://localhost:4003",
        "jwt_key_id": "schema-export-only",
    }
    if service == "identity":
        from cryptography.hazmat.primitives import serialization
        from cryptography.hazmat.primitives.asymmetric import rsa

        fixtures["jwt_private_key"] = (
            rsa.generate_private_key(public_exponent=65537, key_size=2048)
            .private_bytes(
                serialization.Encoding.PEM,
                serialization.PrivateFormat.PKCS8,
                serialization.NoEncryption(),
            )
            .decode()
        )

    settings = OfflineSettings(
        _env_file=None,
        **{
            name: value
            for name, value in fixtures.items()
            if name in OfflineSettings.model_fields
        },
    )
    settings_module.get_settings = lambda: settings
    module = importlib.import_module(f"connected_{service}.main")
    app = module.fastapi_app if service == "identity" else module.app
    schema = app.openapi()
    assert schema.get("openapi") and schema.get("paths"), "Empty OpenAPI contract"
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_text(json.dumps(schema, indent=2, sort_keys=True) + "\n")
    print(f"Exported {service} OpenAPI to {destination}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("service", choices=("identity", "social", "content"))
    parser.add_argument("destination", type=Path)
    args = parser.parse_args()
    export(args.service, args.destination)
PY

COPY services/identity/pyproject.toml services/identity/uv.lock services/identity/

RUN uv sync --project services/identity --locked --no-dev --no-install-project
COPY services/identity/src services/identity/src

RUN uv sync --project services/identity --locked --no-dev --no-editable && services/identity/.venv/bin/python /tmp/export-openapi.py identity /openapi/identity.json

COPY services/social/pyproject.toml services/social/uv.lock services/social/

RUN uv sync --project services/social --locked --no-dev --no-install-project
COPY services/social/src services/social/src

RUN uv sync --project services/social --locked --no-dev --no-editable && services/social/.venv/bin/python /tmp/export-openapi.py social /openapi/social.json

COPY services/content/pyproject.toml services/content/uv.lock services/content/

RUN uv sync --project services/content --locked --no-dev --no-install-project
COPY services/content/src services/content/src

RUN uv sync --project services/content --locked --no-dev --no-editable && services/content/.venv/bin/python /tmp/export-openapi.py content /openapi/content.json

FROM node:24-bookworm-slim@sha256:dc26ae92c9fb15cf6b1d63e20f0944b2efe0f115b20e00be48fb23fceb061c54 AS build

WORKDIR /app

RUN npm install --global pnpm@12.18.0
COPY apps/gateway/package.json apps/gateway/pnpm-lock.yaml apps/gateway/pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile
COPY apps/gateway .
COPY --from=contracts /openapi ./openapi

ARG IDENTITY_URL
ARG SOCIAL_URL
ARG CONTENT_URL

RUN ENVIRONMENT=production OPENAPI_DIR=./openapi IDENTITY_URL="$IDENTITY_URL" SOCIAL_URL="$SOCIAL_URL" CONTENT_URL="$CONTENT_URL" pnpm compose

RUN pnpm prune --prod

FROM node:24-bookworm-slim@sha256:dc26ae92c9fb15cf6b1d63e20f0944b2efe0f115b20e00be48fb23fceb061c54 AS runtime

WORKDIR /app

ENV NODE_ENV=production ENVIRONMENT=production PORT=4000
COPY --from=build --chown=node:node /app ./

USER node

EXPOSE 4000

CMD ["node", "node_modules/@graphql-hive/gateway/dist/bin.js", "--config-path", "gateway.ts", "supergraph", "supergraph.graphql"]
