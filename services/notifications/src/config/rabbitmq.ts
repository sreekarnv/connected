import amqp from "amqplib";
import { passwordResetConsumer } from "../consumers/password-reset.consumer";
import { signupConsumer } from "../consumers/signup.consumer";

export enum Exchange {
	IDENTITY_EVENTS = "identity.events",
}

export enum Queue {
	NOTIFICATIONS_SIGNUP = "notifications.signup",
	NOTIFICATIONS_PASSWORD_RESET = "notifications.password_reset",
}

export enum RoutingKey {
	USER_SIGNUP = "user.signup",
	USER_PASSWORD_RESET_REQUESTED = "user.password_reset_requested",
}

export class RabbitMQConnectionManager {
	private connection?: amqp.RecoveringChannelModel;

	async connect() {
		this.connection = await amqp.connect(process.env.RABBITMQ_URL!, {
			timeout: 10000,
			recovery: {
				waitForConnect: false,
				initialMaxRetries: 5,
				async setup(connection: amqp.ChannelModel) {
					// amqplib attaches its recovery error listener only after setup finishes.
					connection.on("error", () => {});
					const channel = await connection.createChannel();
					channel.on("error", () => {
						console.error("RabbitMQ channel failed; reconnecting");
						void connection.close().catch(() => {});
					});
					await signupConsumer(channel);
					await passwordResetConsumer(channel);
				},
			},
		});
		this.connection.on("error", () => console.error("RabbitMQ connection error"));
		this.connection.on("connect-failed", () =>
			console.error("RabbitMQ connection attempt failed"),
		);
		await this.connection.waitForConnect();
	}

	async close() {
		await this.connection?.close();
	}
}

export const rabbitMqConnectionManager = new RabbitMQConnectionManager();
