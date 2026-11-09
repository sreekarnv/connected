import { Hono } from "hono";
import amqp from "amqplib";

const app = new Hono();

(async () => {
	const connection = await amqp.connect("amqp://connected:connected@localhost");
	const channel = await connection.createChannel();

	await channel.assertExchange("identity.events", "direct", {
		durable: true,
	});
	await channel.assertQueue("notifications.signup", {
		durable: true,
	});
	await channel.bindQueue(
		"notifications.signup",
		"identity.events",
		"user.signup",
	);
	await channel.prefetch(1);

	await channel.consume(
		"notifications.signup",
		(message) => {
			if (message === null) return;

			console.log("Signup received:", message.content.toString());

			channel.ack(message);
		},
		{ noAck: false },
	);
})();

export default {
	port: 4002,
	fetch: app.fetch,
};
