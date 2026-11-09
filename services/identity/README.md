## Alembic migrations

```bash
uv run --no-sync alembic revision --autogenerate -m "description"
uv run --no-sync alembic upgrade head
```

Start the containers using the [root Compose file](../../README.md). To apply migrations to the development database from the repository root:

```bash
docker compose exec identity uv run --no-sync alembic upgrade head
```
