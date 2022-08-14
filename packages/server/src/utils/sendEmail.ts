import nodemailer from 'nodemailer';

interface EmailPayload {
	to: string;
	subject: string;
	text: string;
}

export const sendMail = async (payload: EmailPayload) => {
	let testAccount = await nodemailer.createTestAccount();

	let transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false,
		auth: {
			user: testAccount.user,
			pass: testAccount.pass,
		},
	});

	let info = await transporter.sendMail({
		from: 'example@app.com',
		to: payload.to,
		subject: payload.subject,
		text: payload.text,
	});

	console.log('Message sent: %s', info.messageId);
	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};
