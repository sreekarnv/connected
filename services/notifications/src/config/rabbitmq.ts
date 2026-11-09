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
	private connection?: amqp.ChannelModel;
	private channel?: amqp.Channel;

	async connect() {
		this.connection = await amqp.connect(process.env.RABBITMQ_URL!);
		this.channel = await this.connection.createChannel();
	}

	async registerConsumers() {
		if (!this.channel) {
			throw new Error("channel is not created");
		}

		await signupConsumer(this.channel);
		await passwordResetConsumer(this.channel);
	}
}

export const rabbitMqConnectionManager = new RabbitMQConnectionManager();
