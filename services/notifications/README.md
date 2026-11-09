# Notifications

Bun and Hono notifications service. The HTTP entry point is `src/server.ts`. Email templates, publishers, and workers are not implemented yet.

Start [local RabbitMQ and MailHog](../../README.md), then run from this directory:

```bash
cp .env.example .env
bun install --frozen-lockfile
```

- `bun run dev` starts the server on port 4002 with hot reload.
- `bun run start` starts the server without hot reload.
- `bun run typecheck` checks TypeScript without emitting files.

Runtime packages:

- `hono` provides the HTTP framework.
- `amqplib` connects to RabbitMQ.
- `react-email`, `react`, and `react-dom` render email templates.
- `nodemailer` sends email over SMTP. The local SMTP URL points to MailHog, so no provider credentials are needed.

Development packages include TypeScript, Bun and library types, and `@react-email/ui` for the template preview tooling.

Use `render` and `toPlainText` from `react-email` when adding templates. Nodemailer's SMTP transport accepts `SMTP_URL`. MailHog is a development inbox, not a production delivery provider.

The environment example is for Bun running on the host. A future containerized service on the infrastructure network should use `rabbitmq` and `mailhog` instead of `127.0.0.1`.
