# Connected

Run the development containers from the repository root:

```bash
cp -n .env.example .env
cp -n services/identity/.env.example services/identity/.env
```

For a fresh setup, set `JWT_PRIVATE_KEY` in `services/identity/.env` to an unencrypted RSA private key in PEM format, at least 2048 bits. Keep an existing identity `.env` if one is already configured.

```bash
docker compose up -d
```

The root Compose file runs identity, PostgreSQL, RabbitMQ, and MailHog on one network. Identity waits for PostgreSQL and RabbitMQ to be healthy and connects using their service names. Its `.env` remains in `services/identity`; Compose overrides the database and RabbitMQ URLs for container networking. RabbitMQ credentials can be set in the root `.env`.

- Identity: http://localhost:4001/docs
- PostgreSQL: `localhost:5432`
- RabbitMQ AMQP: `localhost:5672`
- RabbitMQ management: http://localhost:15672 (default login: `connected` / `connected`)
- MailHog SMTP: `localhost:1025`
- MailHog inbox: http://localhost:8025

To start only RabbitMQ and MailHog for services running on the host:

```bash
docker compose up -d rabbitmq mailhog
```

Apply database migrations from the repository root:

```bash
docker compose exec identity uv run --no-sync alembic upgrade head
```

## Moving from the separate Compose files

Before starting the combined project, stop the old projects to release their ports. Run these commands from the repository root using the new Compose file:

```bash
docker compose -p identity down
docker compose -p connected-infra down
docker compose up -d
```

The combined project keeps the original `identity_postgres_data` and `connected-infra_rabbitmq_data` volumes. Do not use `down -v` when moving; it deletes stored data. If you previously used custom Compose project names, update the volume names in `docker-compose.yml` to match your existing volumes before starting.
