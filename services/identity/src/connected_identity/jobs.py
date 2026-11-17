import asyncio
import logging
from datetime import UTC, datetime

from aio_pika.exceptions import AMQPException
from faststream.exceptions import IncorrectState
from sqlalchemy import select, update
from sqlalchemy.exc import SQLAlchemyError

from connected_identity.config.rabbitmq import start_broker
from connected_identity.db.connection import session_factory
from connected_identity.db.schema import (
    EmailVerificationToken,
    PasswordResetToken,
    User,
)
from connected_identity.messaging.email import (
    publish_password_reset_email,
    publish_verification_email,
)
from connected_identity.observability import email_publications

logger = logging.getLogger(__name__)


async def deliver_pending_emails() -> None:
    for model, publish in (
        (EmailVerificationToken, publish_verification_email),
        (PasswordResetToken, publish_password_reset_email),
    ):
        async with session_factory() as db, db.begin():
            await db.execute(
                update(model)
                .where(
                    model.pending_token.is_not(None),
                    model.expires_at <= datetime.now(UTC),
                )
                .values(pending_token=None)
            )
            user_ids = list(
                await db.scalars(
                    select(model.user_id)
                    .where(model.pending_token.is_not(None))
                    .order_by(model.created_at)
                    .limit(100)
                )
            )

        if not user_ids:
            continue
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
                    token = await db.get(model, user_id)
                    if token is None or token.pending_token is None:
                        continue
                    if token.expires_at > datetime.now(UTC) and not (
                        isinstance(token, EmailVerificationToken)
                        and user.email_verified_at is not None
                    ):
                        await publish(user, token.pending_token)
                    # shortcut: a crash after confirmation may resend; tolerate duplicates.
                    token.pending_token = None
                email_publications.labels(
                    "identity", model.__tablename__, "completed"
                ).inc()
            except (
                SQLAlchemyError,
                AMQPException,
                OSError,
                RuntimeError,
                ValueError,
                IncorrectState,
            ):
                email_publications.labels(
                    "identity", model.__tablename__, "retry"
                ).inc()
                logger.error(
                    "email_publication_retry", extra={"queue": model.__tablename__}
                )


async def run_email_worker() -> None:
    while True:
        try:
            await deliver_pending_emails()
        except (SQLAlchemyError, AMQPException, OSError, RuntimeError, IncorrectState):
            email_publications.labels("identity", "worker", "unavailable").inc()
            logger.error("email_worker_unavailable")
        await asyncio.sleep(5)
