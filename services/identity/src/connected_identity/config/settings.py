from functools import lru_cache
from pathlib import Path

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

_ENV_FILE = Path(__file__).resolve().parents[3] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=_ENV_FILE, env_file_encoding="utf-8", hide_input_in_errors=True
    )

    database_url: str
    cors_origins: list[str] = ["http://localhost:4000", "http://127.0.0.1:4000"]
    jwt_private_key: SecretStr = Field(min_length=1)
    jwt_key_id: str = Field(min_length=1)
    jwt_issuer: str = Field(default="connected-identity", min_length=1)
    jwt_audience: str = Field(default="connected-api", min_length=1)


@lru_cache
def get_settings() -> Settings:
    return Settings()
