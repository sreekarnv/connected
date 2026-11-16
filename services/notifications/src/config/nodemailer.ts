import nodemailer, { type SendMailOptions } from "nodemailer";
import type { NotificationsConfig } from "./environment";

export type SendMail = (mail: SendMailOptions) => Promise<unknown>;

export function createMailTransporter(config: NotificationsConfig) {
	return nodemailer.createTransport({
		url: config.smtpUrl,
		connectionTimeout: 10_000,
		greetingTimeout: 10_000,
		socketTimeout: 20_000,
		disableFileAccess: true,
		disableUrlAccess: true,
	}, { from: config.mailFrom });
}
