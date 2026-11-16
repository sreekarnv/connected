import type amqp from "amqplib";
import { createElement } from "react";
import { render, toPlainText } from "react-email";
import { z } from "zod";
import type { SendMail } from "../config/nodemailer";
import { ResetPassword } from "../emails/reset-password";
import { consumeEmail } from "./email-consumer";

const passwordResetEventSchema = z.object({
	email: z.email({ pattern: z.regexes.unicodeEmail }),
	reset_url: z.url({ protocol: /^https?$/ }),
	name: z.string().refine((value) => value.trim().length > 0),
});

export function passwordResetConsumer(channel: amqp.ConfirmChannel, sendMail: SendMail, onFailure: () => void) {
	return consumeEmail(channel, {
		queue: "notifications.password_reset",
		routingKey: "user.password_reset_requested",
		parse: (value) => passwordResetEventSchema.parse(value),
		async send(event) {
			const html = await render(createElement(ResetPassword, {
				name: event.name,
				resetUrl: event.reset_url,
			}));
			await sendMail({
				to: { address: event.email, name: event.name },
				subject: "Reset your Connected password",
				html,
				text: toPlainText(html),
			});
		},
	}, onFailure);
}
