import amqp from "amqplib";
import { signupConsumer } from "../consumers/signup.consumer";

export enum Exchange {
	IDENTITY_EVENTS = "identity.events",
}

export enum Queue {
	NOTIFICATIONS_SIGNUP = "notifications.signup",
}

export enum RoutingKey {
	USER_SIGNUP = "user.signup",
}

export class RabbitMQConnectionManager {
	private connection?: amqp.ChannelModel;
	private channel?: amqp.Channel;

	async connect() {
		this.connection = await amqp.connect(Bun.env.RABBITMQ_URL!);
		this.channel = await this.connection.createChannel();
	}

	async registerConsumers() {
		if (!this.channel) {
			throw new Error("channel is not created");
		}

		await signupConsumer(this.channel);
	}
}

export const rabbitMqConnectionManager = new RabbitMQConnectionManager();
