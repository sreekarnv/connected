import { serve } from "@hono/node-server";
import { createApp } from "./app";
import { ConfigurationError, readEnvironment } from "./config/environment";
import { createMailTransporter } from "./config/nodemailer";
import { RabbitMQConnectionManager } from "./config/rabbitmq";

async function start() {
	const config = readEnvironment();
	const mailTransporter = createMailTransporter(config);
	const rabbit = new RabbitMQConnectionManager(config, (mail) => mailTransporter.sendMail(mail));
	const server = serve({ port: config.port, fetch: createApp(() => rabbit.ready).fetch }, (info) => {
		console.log(`Notifications listening on port ${info.port}`);
	});
	let shuttingDown: Promise<void> | undefined;
	function shutdown() {
		if (shuttingDown) return shuttingDown;
		shuttingDown = (async () => {
			const timeout = setTimeout(() => {
				console.error("Notifications shutdown deadline exceeded");
				void rabbit.abort();
				process.exit(1);
			}, 30_000);
			try {
				await Promise.all([
					rabbit.close(),
					new Promise<void>((resolve) => server.close(() => resolve())),
				]);
			} catch {
				console.error("Notifications shutdown failed");
				process.exitCode = 1;
			} finally {
				mailTransporter.close();
				clearTimeout(timeout);
			}
		})();
		return shuttingDown;
	}
	process.once("SIGINT", shutdown);
	process.once("SIGTERM", shutdown);
	server.on("error", () => {
		console.error("Notifications HTTP server failed");
		process.exitCode = 1;
		void shutdown();
	});
	try {
		await rabbit.connect();
	} catch {
		if (!shuttingDown) {
			console.error("Notifications failed to connect to RabbitMQ");
			process.exitCode = 1;
		}
		await shutdown();
	}
}

void start().catch((error) => {
	console.error(error instanceof ConfigurationError ? error.message : "Notifications failed to start");
	process.exitCode = 1;
});
