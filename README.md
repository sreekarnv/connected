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
