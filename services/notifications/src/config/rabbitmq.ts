import { log } from "../observability";
import amqp from "amqplib";
import type { EmailConsumer } from "../consumers/email-consumer";
import { passwordResetConsumer } from "../consumers/password-reset.consumer";
import { signupConsumer } from "../consumers/signup.consumer";
import type { NotificationsConfig } from "./environment";
import type { SendMail } from "./nodemailer";

export class RabbitMQConnectionManager {
	private connection?: amqp.RecoveringChannelModel;
	private consumers = new Map<EmailConsumer, amqp.ConfirmChannel>();
	private connected = false;
	private blocked = false;
	private stopping = false;

	constructor(private config: NotificationsConfig, private sendMail: SendMail) {}

	get ready() { return this.connected && !this.blocked && !this.stopping; }

	async connect() {
		this.connection = await amqp.connect(this.config.rabbitmqUrl, {
			timeout: 10_000,
			recovery: {
				waitForConnect: false,
				initialMaxRetries: 5,
				initialDelay: 5_000,
				maxDelay: 30_000,
				jitter: 0,
				setup: async (connection: amqp.ChannelModel) => {
					let failed = false;
					const restart = () => {
						this.connected = false;
						if (failed || this.stopping) return;
						failed = true;
						void connection.close().catch(() => {});
					};
					// Recovery attaches its error listener only after setup finishes.
					connection.on("error", restart);
					connection.once("close", () => { this.connected = false; });
					for (const consume of [signupConsumer, passwordResetConsumer]) {
						if (this.stopping) throw new Error("Notifications stopping");
						const channel = await connection.createConfirmChannel();
						channel.on("error", restart);
						channel.once("close", restart);
						const consumer = await consume(channel, this.sendMail, restart);
						this.consumers.set(consumer, channel);
						channel.once("close", () => {
							void consumer.drain().finally(() => { this.consumers.delete(consumer); });
						});
					}
					if (failed || this.stopping) throw new Error("Notifications consumers unavailable");
				},
			},
		});
		this.connection.on("connect", () => { this.connected = true; this.blocked = false; });
		this.connection.on("disconnect", () => { this.connected = false; });
		this.connection.on("blocked", () => { this.blocked = true; });
		this.connection.on("unblocked", () => { this.blocked = false; });
		this.connection.on("error", () => log("error", "RabbitMQ connection error"));
		this.connection.on("connect-failed", () => log("error", "RabbitMQ connection attempt failed"));
		await this.connection.waitForConnect();
	}

	async close() {
		this.stopping = true;
		this.connected = false;
		try {
			await Promise.all([...this.consumers.keys()].map((consumer) => consumer.cancel()));
			await Promise.all([...this.consumers.keys()].map((consumer) => consumer.drain()));
			// Channel-close handshakes flush the final acknowledgements before connection close.
			await Promise.all([...this.consumers.values()].map((channel) => channel.close()));
		} finally {
			await this.connection?.close();
		}
	}

	async abort() {
		this.stopping = true;
		this.connected = false;
		await this.connection?.close();
	}
}
