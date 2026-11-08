## Alembic migrations

```bash
uv run --no-sync alembic revision --autogenerate -m "description"
uv run --no-sync alembic upgrade head
```

To apply migrations to the development database from the container:

```bash
docker compose exec identity uv run --no-sync alembic upgrade head
```
