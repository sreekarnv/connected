from functools import lru_cache
from pathlib import Path
from urllib.parse import urlsplit

from pydantic import Field, SecretStr, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

_ENV_FILE = Path(__file__).resolve().parents[3] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=_ENV_FILE, env_file_encoding="utf-8", hide_input_in_errors=True
    )

    database_url: str
    public_url: str = "http://localhost:4001"
    cors_origins: list[str] = ["http://localhost:4000", "http://127.0.0.1:4000"]
    refresh_cookie_secure: bool = True
    jwt_private_key: SecretStr = Field(min_length=1)
    jwt_key_id: str = Field(min_length=1)
    jwt_issuer: str = Field(default="connected-identity", min_length=1)
    jwt_audience: str = Field(default="connected-api", min_length=1)
    rabbitmq_url: str

    @field_validator("public_url")
    @classmethod
    def validate_public_url(cls, origin: str) -> str:
        cls.validate_cors_origins([origin])
        if urlsplit(origin).port == 0:
            raise ValueError("PUBLIC_URL must use a port between 1 and 65535")
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
