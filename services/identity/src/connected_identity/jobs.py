import asyncio
import logging
from datetime import UTC, datetime

from aio_pika.exceptions import AMQPException
from faststream.exceptions import IncorrectState
from sqlalchemy import select, update
from sqlalchemy.exc import SQLAlchemyError

from connected_identity.config.rabbitmq import start_broker
from connected_identity.db.connection import session_factory
from connected_identity.db.schema import EmailVerificationToken, User
from connected_identity.messaging.email import (
    publish_password_reset_email,
    publish_verification_email,
)
from connected_identity.services.password_reset import request_password_reset

logger = logging.getLogger(__name__)


async def deliver_verification_emails() -> None:
    async with session_factory() as db, db.begin():
        await db.execute(
            update(EmailVerificationToken)
            .where(
                EmailVerificationToken.pending_token.is_not(None),
                EmailVerificationToken.expires_at <= datetime.now(UTC),
            )
            .values(pending_token=None)
        )
        user_ids = list(
            await db.scalars(
                select(EmailVerificationToken.user_id)
                .where(EmailVerificationToken.pending_token.is_not(None))
                .order_by(EmailVerificationToken.created_at)
                .limit(100)
            )
        )

    async with asyncio.timeout(10):
        await start_broker()

    for user_id in user_ids:
        try:
            async with asyncio.timeout(15), session_factory() as db, db.begin():
                user = await db.scalar(
                    select(User)
                    .where(User.id == user_id)
                    .with_for_update(skip_locked=True)
                )
                if user is None:
                    continue
                token = await db.get(EmailVerificationToken, user_id)
                if token is None or token.pending_token is None:
                    continue
                if (
                    token.expires_at > datetime.now(UTC)
                    and user.email_verified_at is None
                ):
                    await publish_verification_email(user, token.pending_token)
                # shortcut: a crash after confirmation may resend; deduplicate if needed.
                token.pending_token = None
        except (
            SQLAlchemyError,
            AMQPException,
            OSError,
            RuntimeError,
            ValueError,
            IncorrectState,
        ):
            logger.error("Verification email remains queued for retry")


async def run_verification_email_worker() -> None:
    while True:
        try:
            await deliver_verification_emails()
        except (SQLAlchemyError, AMQPException, OSError, RuntimeError, IncorrectState):
            logger.error("Verification email delivery is unavailable; retrying")
        await asyncio.sleep(5)


async def send_password_reset_email(email: str) -> None:
    # shortcut: in-process email work can be lost on restart; use durable jobs for guaranteed delivery.
    try:
        async with asyncio.timeout(10):
            await start_broker()
        async with session_factory() as db:
            delivery = await request_password_reset(db, email)
            if delivery is not None:
                user, token = delivery
                await publish_password_reset_email(user, token)
    except (SQLAlchemyError, AMQPException, OSError, RuntimeError, IncorrectState):
        logger.error("Password reset email could not be sent")
