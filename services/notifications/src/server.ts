import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { rabbitMqConnectionManager } from "./config/rabbitmq";

const app = new Hono();

(async () => {
	await rabbitMqConnectionManager.connect();
	await rabbitMqConnectionManager.registerConsumers();

	serve(
		{
			port: 4002,
			fetch: app.fetch,
		},
		(info) => {
			console.log(`Notifications listening on http://localhost:${info.port}`);
		},
	);
})();
