import amqp from "amqplib";
import { createElement } from "react";
import { render, toPlainText } from "react-email";
import { z } from "zod";
import { mailTransporter } from "../config/nodemailer";
import { Exchange, Queue, RoutingKey } from "../config/rabbitmq";
import { VerifyEmail } from "../emails/verify-email";

const signupEventSchema = z.object({
	email: z.email(),
	verification_url: z.url({ protocol: /^https?$/ }),
	name: z.string().refine((value) => value.trim().length > 0),
});

export async function signupConsumer(channel: amqp.Channel) {
	await channel.assertExchange(Exchange.IDENTITY_EVENTS, "direct", {
		durable: true,
	});

	await channel.assertQueue(Queue.NOTIFICATIONS_SIGNUP, {
		durable: true,
	});

	await channel.bindQueue(
		Queue.NOTIFICATIONS_SIGNUP,
		Exchange.IDENTITY_EVENTS,
		RoutingKey.USER_SIGNUP,
	);

	await channel.prefetch(1);

	await channel.consume(
		Queue.NOTIFICATIONS_SIGNUP,
		async (message) => {
			if (message === null) return;

			let event: z.infer<typeof signupEventSchema>;
			try {
				event = signupEventSchema.parse(JSON.parse(message.content.toString()));
			} catch {
				console.error("Invalid signup event");
				channel.nack(message, false, false);
				return;
			}

			try {
				const html = await render(
					createElement(VerifyEmail, {
						name: event.name,
						verificationUrl: event.verification_url,
					}),
				);
				await mailTransporter.sendMail({
					to: { address: event.email, name: event.name },
					subject: "Verify your Connected email",
					html,
					text: toPlainText(html),
				});
			} catch (error) {
				console.error("Signup email failed", error);
				// shortcut: failures requeue immediately, use a delayed retry queue if SMTP outages cause a retry loop.
				channel.nack(message, false, true);
				return;
			}

			channel.ack(message);
		},
		{
			noAck: false,
		},
	);
}
