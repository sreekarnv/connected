# Notifications

Sends account verification emails. Requires Node.js 24+ and pnpm.

Start [RabbitMQ and MailHog](../../README.md), then run from this directory:

```bash
cp .env.example .env
pnpm install --frozen-lockfile
pnpm dev
```

The server runs at http://localhost:4002. View local emails at http://localhost:8025.

Use `pnpm start` to run without watching, or `pnpm typecheck` to check TypeScript.
