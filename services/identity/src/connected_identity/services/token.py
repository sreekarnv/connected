from datetime import UTC, datetime, timedelta
from functools import lru_cache
from uuid import UUID

import jwt
from cryptography.exceptions import UnsupportedAlgorithm
from cryptography.hazmat.primitives.asymmetric.rsa import RSAPrivateKey
from cryptography.hazmat.primitives.serialization import load_pem_private_key
from jwt.algorithms import RSAAlgorithm
from jwt.exceptions import InvalidTokenError

from connected_identity.config.settings import get_settings

ACCESS_TOKEN_TTL_SECONDS = 15 * 60


@lru_cache
def get_signing_key() -> RSAPrivateKey:
    settings = get_settings()

    try:
        key = load_pem_private_key(
            settings.jwt_private_key.get_secret_value().encode(), password=None
        )

    except (ValueError, TypeError, UnsupportedAlgorithm):
        raise ValueError(
            "JWT_PRIVATE_KEY must be an unencrypted RSA private key in PEM format"
        ) from None

    if not isinstance(key, RSAPrivateKey) or key.key_size < 2048:
        raise ValueError(
            "JWT_PRIVATE_KEY must be an RSA private key of at least 2048 bits"
        )

    return key


def create_access_token(user_id: UUID) -> str:
    settings = get_settings()
    now = datetime.now(UTC)

    return jwt.encode(
        {
            "sub": str(user_id),
            "iat": now,
            "exp": now + timedelta(seconds=ACCESS_TOKEN_TTL_SECONDS),
            "iss": settings.jwt_issuer,
            "aud": settings.jwt_audience,
        },
        get_signing_key(),
        algorithm="RS256",
        headers={"kid": settings.jwt_key_id, "typ": "at+jwt"},
    )


def decode_access_token(token: str) -> UUID:
    settings = get_settings()
    header = jwt.get_unverified_header(token)
    if header.get("kid") != settings.jwt_key_id or header.get("typ") != "at+jwt":
        raise InvalidTokenError("Invalid access token headers")

    claims = jwt.decode(
        token,
        get_signing_key().public_key(),
        algorithms=["RS256"],
        issuer=settings.jwt_issuer,
        audience=settings.jwt_audience,
        options={"require": ["sub", "iat", "exp", "iss", "aud"]},
    )

    return UUID(claims["sub"])


def get_jwks() -> dict[str, list[dict[str, str]]]:
    key = RSAAlgorithm.to_jwk(get_signing_key().public_key(), as_dict=True)

    return {
        "keys": [
            {
                "kty": key["kty"],
                "kid": get_settings().jwt_key_id,
                "use": "sig",
                "alg": "RS256",
                "n": key["n"],
                "e": key["e"],
            }
        ]
    }
