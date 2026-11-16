from functools import lru_cache
from pathlib import Path
from typing import Literal
from urllib.parse import urlsplit

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_ENV_FILE = Path(__file__).resolve().parents[3] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=_ENV_FILE, env_file_encoding="utf-8", hide_input_in_errors=True
    )

    environment: Literal["development", "production"] = "development"
    database_url: str
    identity_url: str = "http://localhost:4001"
    social_url: str = "http://localhost:4003"
    cors_origins: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:4000",
        "http://127.0.0.1:4000",
    ]

    @model_validator(mode="after")
    def production_settings(self) -> "Settings":
        if self.environment != "production":
            return self
        try:
            database = urlsplit(self.database_url)
            database_port = database.port
        except ValueError:
            raise ValueError("DATABASE_URL must be a valid PostgreSQL URL") from None
        if (
            database.scheme != "postgresql+asyncpg"
            or not database.hostname
            or not database.username
            or not database.password
            or not database.path.lstrip("/")
            or database_port == 0
            or database.fragment
            or any(character.isspace() for character in self.database_url)
        ):
            raise ValueError(
                "DATABASE_URL requires postgresql+asyncpg, host, username, password, "
                "database name, and a valid port"
            )
        for field in ("identity_url", "social_url"):
            address = getattr(self, field)
            url = urlsplit(address)
            try:
                port = url.port
            except ValueError:
                raise ValueError(f"{field.upper()} has an invalid port") from None
            if (
                field not in self.model_fields_set
                or url.scheme not in {"http", "https"}
                or not url.hostname
                or url.hostname in {"localhost", "127.0.0.1", "::1"}
                or url.username is not None
                or url.password is not None
                or url.query
                or url.fragment
                or url.path not in {"", "/"}
                or port == 0
                or any(character.isspace() for character in address)
            ):
                raise ValueError(f"{field.upper()} must be an explicit service origin")
        if "cors_origins" not in self.model_fields_set:
            raise ValueError(
                "CORS_ORIGINS must be explicit (use [] for private services)"
            )
        for origin in self.cors_origins:
            url = urlsplit(origin)
            try:
                port = url.port
            except ValueError:
                raise ValueError("CORS_ORIGINS contains an invalid port") from None
            if (
                url.scheme != "https"
                or not url.hostname
                or url.username is not None
                or url.password is not None
                or url.path
                or url.query
                or url.fragment
                or "*" in origin
                or port == 0
                or any(character.isspace() for character in origin)
            ):
                raise ValueError("CORS_ORIGINS must contain exact HTTPS origins")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
