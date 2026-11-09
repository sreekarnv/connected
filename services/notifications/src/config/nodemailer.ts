import nodemailer from "nodemailer";

const {
	SMTP_URL = "smtp://127.0.0.1:1025",
	MAIL_FROM = "Connected <notifications@connected.test>",
} = Bun.env;

export const mailTransporter = nodemailer.createTransport(SMTP_URL, {
	from: MAIL_FROM,
});
