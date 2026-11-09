import amqp from "amqplib";
import { createElement } from "react";
import { render, toPlainText } from "react-email";
import { z } from "zod";
import { mailTransporter } from "../config/nodemailer";
import { Exchange, Queue, RoutingKey } from "../config/rabbitmq";
import { ResetPassword } from "../emails/reset-password";

const passwordResetEventSchema = z.object({
	email: z.email(),
	reset_url: z.url({ protocol: /^https?$/ }),
	name: z.string().refine((value) => value.trim().length > 0),
});

export async function passwordResetConsumer(channel: amqp.Channel) {
	await channel.assertExchange(Exchange.IDENTITY_EVENTS, "direct", {
		durable: true,
	});

	await channel.assertQueue(Queue.NOTIFICATIONS_PASSWORD_RESET, {
		durable: true,
	});
	await channel.bindQueue(
		Queue.NOTIFICATIONS_PASSWORD_RESET,
		Exchange.IDENTITY_EVENTS,
		RoutingKey.USER_PASSWORD_RESET_REQUESTED,
	);
	await channel.prefetch(1);

	await channel.consume(
		Queue.NOTIFICATIONS_PASSWORD_RESET,
		async (message) => {
			if (message === null) return;

			let event: z.infer<typeof passwordResetEventSchema>;
			try {
				event = passwordResetEventSchema.parse(
					JSON.parse(message.content.toString()),
				);
			} catch {
				console.error("Invalid password reset event");
				channel.nack(message, false, false);
				return;
			}

			try {
				const html = await render(
					createElement(ResetPassword, {
						name: event.name,
						resetUrl: event.reset_url,
					}),
				);
				await mailTransporter.sendMail({
					to: { address: event.email, name: event.name },
					subject: "Reset your Connected password",
					html,
					text: toPlainText(html),
				});
			} catch {
				console.error("Password reset email failed");
				// shortcut: failures requeue immediately, use a delayed retry queue if SMTP outages cause a retry loop.
				channel.nack(message, false, true);
				return;
			}

			channel.ack(message);
		},
		{ noAck: false },
	);
}
