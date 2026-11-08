## Alembic migrations

```bash
uv run --no-sync alembic revision --autogenerate -m "description"
uv run --no-sync alembic upgrade head
```
