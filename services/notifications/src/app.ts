import { Hono } from "hono";
import { matchedRoutes } from "hono/route";
import { duration, log, registry, requests } from "./observability";

export function createApp(isReady: () => boolean) {
	const app = new Hono();

	app.use(async (context, next) => {
		if (context.req.path === "/metrics") return next();

		const start = performance.now();
		await next();

		const route =
			matchedRoutes(context).findLast((match) => match.path !== "/*")?.path ??
			"unmatched";

		const method = [
			"GET",
			"HEAD",
			"POST",
			"PUT",
			"PATCH",
			"DELETE",
			"OPTIONS",
		].includes(context.req.method)
			? context.req.method
			: "OTHER";

		const elapsed = (performance.now() - start) / 1000;
		requests.inc({ method, route, status: context.res.status });

		duration.observe({ method, route }, elapsed);

		log(context.res.status >= 500 ? "error" : "info", "http_request", {
			method,
			route,
			status: context.res.status,
			duration_seconds: elapsed,
		});
	});

	app.onError((_error, context) => context.text("Internal Server Error", 500));

	app.get("/metrics", async (context) => {
		context.header("Content-Type", registry.contentType);
		context.header("Cache-Control", "no-store");
		return context.body(await registry.metrics());
	});

	app.get("/livez", (context) => context.json({ status: "ok" }));

	app.get("/readyz", (context) =>
		isReady()
			? context.json({ status: "ok" })
			: context.json({ status: "unavailable" }, 503),
	);

	return app;
}
