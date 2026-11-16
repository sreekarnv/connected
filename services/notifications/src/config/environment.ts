import { z } from "zod";

export class ConfigurationError extends Error {}

export function readEnvironment(env: NodeJS.ProcessEnv = process.env) {
	const environment = env.ENVIRONMENT ?? "development";
	if (!["development", "test", "production"].includes(environment)) {
		throw new ConfigurationError("ENVIRONMENT must be development, test, or production");
	}
	const production = environment === "production";
	const port = env.PORT ?? "4002";
	if (!/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
		throw new ConfigurationError("PORT must be an integer between 1 and 65535");
	}
	function url(name: string, fallback: string, protocols: string[]) {
		const value = env[name] ?? (production ? "" : fallback);
		let parsed: URL;
		try {
			parsed = new URL(value);
		} catch {
			throw new ConfigurationError(`${name} must be a valid URL`);
		}
		if (!protocols.includes(parsed.protocol) || !parsed.hostname) {
			throw new ConfigurationError(`${name} has an unsupported protocol or missing host`);
		}
		if (production && (!parsed.username || !parsed.password || parsed.username === "guest" ||
			(parsed.username === "connected" && parsed.password === "connected"))) {
			throw new ConfigurationError(`${name} requires non-default credentials in production`);
		}
		return value;
	}
	const rabbitmqUrl = url("RABBITMQ_URL", "amqp://connected:connected@127.0.0.1:5672", ["amqp:", "amqps:"]);
	const smtpUrl = url("SMTP_URL", "smtp://127.0.0.1:1025", ["smtp:", "smtps:"]);
	const mailFrom = env.MAIL_FROM ?? (production ? "" : "Connected <notifications@connected.test>");
	const from = /^(?:[^<>\r\n]+<([^<>\r\n]+)>|([^<>\r\n]+))$/.exec(mailFrom);
	const address = from?.[1] ?? from?.[2] ?? "";
	if (!z.email({ pattern: z.regexes.unicodeEmail }).safeParse(address).success ||
		(production && /@(?:[^@]*\.)?(?:test|example|invalid|localhost)$/i.test(address))) {
		throw new ConfigurationError("MAIL_FROM must contain a valid sender email address for this environment");
	}
	return { port: Number(port), rabbitmqUrl, smtpUrl, mailFrom };
}

export type NotificationsConfig = ReturnType<typeof readEnvironment>;
