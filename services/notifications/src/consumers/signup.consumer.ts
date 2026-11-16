import type amqp from "amqplib";
import { createElement } from "react";
import { render, toPlainText } from "react-email";
import { z } from "zod";
import type { SendMail } from "../config/nodemailer";
import { VerifyEmail } from "../emails/verify-email";
import { consumeEmail } from "./email-consumer";

const signupEventSchema = z.object({
	email: z.email({ pattern: z.regexes.unicodeEmail }),
	verification_url: z.url({ protocol: /^https?$/ }),
	name: z.string().refine((value) => value.trim().length > 0),
});

export function signupConsumer(channel: amqp.ConfirmChannel, sendMail: SendMail, onFailure: () => void) {
	return consumeEmail(channel, {
		queue: "notifications.signup",
		routingKey: "user.signup",
		parse: (value) => signupEventSchema.parse(value),
		async send(event) {
			const html = await render(createElement(VerifyEmail, {
				name: event.name,
				verificationUrl: event.verification_url,
			}));
			await sendMail({
				to: { address: event.email, name: event.name },
				subject: "Verify your Connected email",
				html,
				text: toPlainText(html),
			});
		},
	}, onFailure);
}
