from urllib.parse import urlencode

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric.padding import MGF1, OAEP

from connected_identity.config.rabbitmq import broker, identity_events
from connected_identity.config.settings import get_settings
from connected_identity.db.schema import User
from connected_identity.services.token import get_signing_key

_verification_padding = OAEP(
    mgf=MGF1(hashes.SHA256()),
    algorithm=hashes.SHA256(),
    label=b"connected-verification-email",
)


def encrypt_verification_token(token: str) -> bytes:
    return get_signing_key().public_key().encrypt(token.encode(), _verification_padding)


async def publish_verification_email(user: User, pending_token: bytes) -> None:
    # shortcut: pending tokens use the signing key; drain deliveries before rotating it.
    token = get_signing_key().decrypt(pending_token, _verification_padding).decode()
    confirmation = await broker.publish(
        {
            "user_id": str(user.id),
            "email": user.email,
            "name": user.name,
            "verification_url": (
                f"{get_settings().web_url}/verify-email#{urlencode({'token': token})}"
            ),
        },
        exchange=identity_events,
        routing_key="user.signup",
        persist=True,
        timeout=10,
    )
    if confirmation is None or confirmation.name != "Basic.Ack":
        raise RuntimeError("Verification email publication was not confirmed")


async def publish_password_reset_email(user: User, token: str) -> None:
    await broker.publish(
        {
            "email": user.email,
            "name": user.name,
            "reset_url": (
                f"{get_settings().web_url}/reset-password#{urlencode({'token': token})}"
            ),
        },
        exchange=identity_events,
        routing_key="user.password_reset_requested",
        persist=True,
    )
