from faststream.rabbit import ExchangeType, RabbitBroker, RabbitExchange, RabbitQueue

from connected_identity.config.settings import get_settings

settings = get_settings()

broker = RabbitBroker(settings.rabbitmq_url)

identity_events = RabbitExchange(
    "identity.events", durable=True, type=ExchangeType.DIRECT
)

signup_notifications = RabbitQueue(
    "notifications.signup",
    durable=True,
)
