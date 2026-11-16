import { Hono } from "hono";

export function createApp(isReady: () => boolean) {
	const app = new Hono();
	app.get("/livez", (context) => context.json({ status: "ok" }));
	app.get("/readyz", (context) => isReady()
		? context.json({ status: "ok" })
		: context.json({ status: "unavailable" }, 503));
	return app;
}
