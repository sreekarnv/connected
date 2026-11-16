import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { rabbitMqConnectionManager } from "./config/rabbitmq";

const app = new Hono();

(async () => {
	await rabbitMqConnectionManager.connect();

	const server = serve(
		{
			port: 4002,
			fetch: app.fetch,
		},
		(info) => {
			console.log(`Notifications listening on http://localhost:${info.port}`);
		},
	);
	const shutdown = () => {
		server.close();
		void rabbitMqConnectionManager.close().catch(() => {
			console.error("RabbitMQ shutdown failed");
			process.exitCode = 1;
		});
	};
	process.once("SIGINT", shutdown);
	process.once("SIGTERM", shutdown);
})().catch(async () => {
	console.error("Notifications failed to start");
	await rabbitMqConnectionManager.close();
	process.exitCode = 1;
});
