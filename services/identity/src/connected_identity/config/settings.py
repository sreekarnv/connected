from functools import lru_cache
from pathlib import Path
from typing import Literal, Self
from urllib.parse import urlsplit

from pydantic import Field, SecretStr, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_ENV_FILE = Path(__file__).resolve().parents[3] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=_ENV_FILE, env_file_encoding="utf-8", hide_input_in_errors=True
    )

    environment: Literal["development", "production"] = "development"
    database_url: str
    public_url: str = "http://localhost:4001"
    web_url: str = "http://localhost:3000"
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:4000",
        "http://127.0.0.1:4000",
    ]
    refresh_cookie_secure: bool = True
    jwt_private_key: SecretStr = Field(min_length=1)
    jwt_key_id: str = Field(min_length=1)
    jwt_issuer: str = Field(default="connected-identity", min_length=1)
    jwt_audience: str = Field(default="connected-api", min_length=1)
    rabbitmq_url: str

    @model_validator(mode="after")
    def validate_production(self) -> Self:
        if self.environment == "production":
            try:
                database = urlsplit(self.database_url)
                valid_database = (
                    database.scheme == "postgresql+asyncpg"
                    and database.hostname
                    and database.username
                    and database.password
                    and database.path not in {"", "/"}
                    and database.port != 0
                    and not database.fragment
                    and not any(character.isspace() for character in self.database_url)
                )
            except ValueError:
                valid_database = False
            if not valid_database:
                raise ValueError(
                    "DATABASE_URL requires a PostgreSQL host, database, and credentials"
                )
            try:
                broker = urlsplit(self.rabbitmq_url)
                valid_broker = (
                    broker.scheme in {"amqp", "amqps"}
                    and broker.hostname
                    and broker.username
                    and broker.password
                    and broker.port != 0
                    and not broker.fragment
                    and broker.username != "guest"
                    and (broker.username, broker.password) != ("connected", "connected")
                    and not any(character.isspace() for character in self.rabbitmq_url)
                )
            except ValueError:
                valid_broker = False
            if not valid_broker:
                raise ValueError(
                    "RABBITMQ_URL requires a host and non-default credentials"
                )
            if not self.refresh_cookie_secure:
                raise ValueError("Production requires secure refresh cookies")
            if any(
                urlsplit(origin).scheme != "https"
                for origin in (self.public_url, self.web_url, *self.cors_origins)
            ):
                raise ValueError(
                    "Production public URLs and CORS origins require HTTPS"
                )
        return self

    @field_validator("public_url", "web_url")
    @classmethod
    def validate_public_url(cls, origin: str) -> str:
        cls.validate_cors_origins([origin])

        if urlsplit(origin).port == 0:
            raise ValueError("Public URLs must use a port between 1 and 65535")

        return origin

    @field_validator("cors_origins")
    @classmethod
    def validate_cors_origins(cls, origins: list[str]) -> list[str]:
        for origin in origins:
            parsed = urlsplit(origin)

            if (
                parsed.scheme not in {"http", "https"}
                or not parsed.hostname
                or parsed.username is not None
                or parsed.password is not None
                or origin != f"{parsed.scheme}://{parsed.netloc}"
                or "*" in origin
                or any(character.isspace() for character in origin)
            ):
                raise ValueError("CORS origins must be exact HTTP(S) origins")

        return origins


@lru_cache
def get_settings() -> Settings:
    return Settings()
