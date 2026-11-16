import asyncio

from faststream.rabbit import (
    Channel,
    ExchangeType,
    RabbitBroker,
    RabbitExchange,
    RabbitQueue,
)

from connected_identity.config.settings import get_settings

settings = get_settings()

broker = RabbitBroker(
    settings.rabbitmq_url,
    timeout=10,
    default_channel=Channel(publisher_confirms=True, on_return_raises=True),
)

identity_events = RabbitExchange(
    "identity.events", durable=True, type=ExchangeType.DIRECT
)

signup_notifications = RabbitQueue(
    "notifications.signup",
    durable=True,
)

password_reset_notifications = RabbitQueue("notifications.password_reset", durable=True)
_connection_lock = asyncio.Lock()


async def start_broker() -> None:
    async with _connection_lock:
        await broker.start()
        exchange = await broker.declare_exchange(identity_events)
        queue = await broker.declare_queue(signup_notifications)
        await queue.bind(exchange, routing_key="user.signup")
        reset_queue = await broker.declare_queue(password_reset_notifications)
        await reset_queue.bind(exchange, routing_key="user.password_reset_requested")


async def stop_broker() -> None:
    await broker.stop()
