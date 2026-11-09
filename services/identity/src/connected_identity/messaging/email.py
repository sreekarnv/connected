from urllib.parse import urlencode

from connected_identity.config.rabbitmq import broker, identity_events
from connected_identity.config.settings import get_settings
from connected_identity.db.schema import User


async def publish_verification_email(user: User, token: str) -> None:
    await broker.publish(
        {
            "user_id": str(user.id),
            "email": user.email,
            "name": user.name,
            "verification_url": (
                f"{get_settings().public_url}/api/v1/auth/verify-email"
                f"#{urlencode({'token': token})}"
            ),
        },
        exchange=identity_events,
        routing_key="user.signup",
        persist=True,
    )


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
