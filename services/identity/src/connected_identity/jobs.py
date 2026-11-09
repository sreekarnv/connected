import logging

from aio_pika.exceptions import AMQPException
from sqlalchemy.exc import SQLAlchemyError

from connected_identity.db.connection import session_factory
from connected_identity.messaging.email import publish_password_reset_email
from connected_identity.services.password_reset import request_password_reset

logger = logging.getLogger(__name__)


async def send_password_reset_email(email: str) -> None:
    # shortcut: in-process email work can be lost on restart; use durable jobs for guaranteed delivery.
    try:
        async with session_factory() as db:
            delivery = await request_password_reset(db, email)
            if delivery is not None:
                user, token = delivery
                await publish_password_reset_email(user, token)
    except (SQLAlchemyError, AMQPException, OSError, RuntimeError):
        logger.error("Password reset email could not be sent")
