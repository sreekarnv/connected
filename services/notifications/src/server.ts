import { Hono } from "hono";
import { rabbitMqConnectionManager } from "./config/rabbitmq";

const app = new Hono();

(async () => {
	await rabbitMqConnectionManager.connect();
	await rabbitMqConnectionManager.registerConsumers();
})();

export default {
	port: 4002,
	fetch: app.fetch,
};
