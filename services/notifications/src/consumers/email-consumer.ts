import { log, deliveries } from "../observability";
import type amqp from "amqplib";

export const IDENTITY_EXCHANGE = "identity.events";
export const RETRY_DELAYS_MS = [30_000, 120_000, 600_000] as const;
export const FAILED_RETENTION_MS = 24 * 60 * 60 * 1000;
const RETRY_HEADER = "x-notification-retry";

export function retryQueue(queue: string, attempt: number) {
	return `${queue}.retry.v1.${attempt}`;
}

export function failedQueue(queue: string) {
	return `${queue}.failed.v1`;
}

export interface EmailConsumer {
	cancel(): Promise<void>;
	drain(): Promise<void>;
}

export async function publishConfirmed(
	channel: amqp.ConfirmChannel,
	queue: string,
	message: amqp.ConsumeMessage,
	headers: Record<string, string | number>,
) {
	// Each consumer has its own channel and prefetch=1, so only one publish is pending.
	let returned = false;
	const onReturn = () => {
		returned = true;
	};
	channel.on("return", onReturn);
	let timeout: NodeJS.Timeout | undefined;
	try {
		await new Promise<void>((resolve, reject) => {
			timeout = setTimeout(
				() => reject(new Error("Email publication confirmation timed out")),
				10_000,
			);
			channel.sendToQueue(
				queue,
				message.content,
				{
					persistent: true,
					mandatory: true,
					contentType: message.properties.contentType ?? "application/json",
					messageId: message.properties.messageId,
					correlationId: message.properties.correlationId,
					headers,
				},
				(error) => {
					if (error || returned)
						reject(new Error("Email destination did not confirm delivery"));
					else resolve();
				},
			);
		});
	} finally {
		clearTimeout(timeout);
		channel.removeListener("return", onReturn);
	}
}

export async function consumeEmail<Event>(
	channel: amqp.ConfirmChannel,
	options: {
		queue: string;
		routingKey: string;
		parse(value: unknown): Event;
		send(event: Event): Promise<void>;
	},
	onFailure: () => void,
): Promise<EmailConsumer> {
	let active = true;
	let stopping = false;
	const pending = new Set<Promise<void>>();
	channel.once("close", () => {
		active = false;
	});
	await channel.assertExchange(IDENTITY_EXCHANGE, "direct", { durable: true });
	// Identity declares these existing queues without arguments; keep them compatible.
	await channel.assertQueue(options.queue, { durable: true });
	await channel.bindQueue(options.queue, IDENTITY_EXCHANGE, options.routingKey);
	for (const [index, delay] of RETRY_DELAYS_MS.entries()) {
		await channel.assertQueue(retryQueue(options.queue, index + 1), {
			durable: true,
			arguments: {
				"x-queue-type": "quorum",
				"x-message-ttl": delay,
				"x-dead-letter-exchange": IDENTITY_EXCHANGE,
				"x-dead-letter-routing-key": options.routingKey,
				"x-dead-letter-strategy": "at-least-once",
				"x-overflow": "reject-publish",
			},
		});
	}
	await channel.assertQueue(failedQueue(options.queue), {
		durable: true,
		arguments: {
			"x-queue-type": "quorum",
			"x-message-ttl": FAILED_RETENTION_MS,
		},
	});
	await channel.prefetch(1);

	async function handle(message: amqp.ConsumeMessage) {
		let event: Event;
		const attempt: unknown = message.properties.headers?.[RETRY_HEADER] ?? 0;

		let destination = failedQueue(options.queue);
		let headers: Record<string, string | number> = {
			"x-notification-failure": "invalid-event",
		};

		try {
			if (
				typeof attempt !== "number" ||
				!Number.isInteger(attempt) ||
				attempt < 0 ||
				attempt > RETRY_DELAYS_MS.length
			) {
				throw new Error("Invalid retry count");
			}

			event = options.parse(JSON.parse(message.content.toString()));
		} catch {
			log("error", "invalid_email_event", { queue: options.queue });

			if (active) {
				await publishConfirmed(channel, destination, message, headers);
				if (active) {
					deliveries.inc({ queue: options.queue, outcome: "invalid" });
					channel.ack(message);
				}
			}

			return;
		}

		try {
			await options.send(event);
			deliveries.inc({ queue: options.queue, outcome: "sent" });
			log("info", "email_sent", { queue: options.queue });
		} catch {
			log("error", "email_delivery_failed", { queue: options.queue });
			deliveries.inc({ queue: options.queue, outcome: "send_failed" });

			if (!active) return;

			if (attempt < RETRY_DELAYS_MS.length)
				destination = retryQueue(options.queue, attempt + 1);

			headers = {
				[RETRY_HEADER]: attempt + 1,
				"x-notification-failure": "delivery-failed",
			};

			await publishConfirmed(channel, destination, message, headers);

			deliveries.inc({
				queue: options.queue,
				outcome: attempt < RETRY_DELAYS_MS.length ? "retry" : "failed",
			});
		}
		if (active) channel.ack(message);
	}

	const { consumerTag } = await channel.consume(
		options.queue,
		(message) => {
			if (message === null) {
				active = false;
				onFailure();
				return;
			}

			if (stopping || !active) return;

			const work = handle(message).catch(() => {
				// Keep the original unacknowledged; reconnect with backoff to recover it.
				active = false;
				log("error", "email_consumer_interrupted", { queue: options.queue });
				deliveries.inc({ queue: options.queue, outcome: "interrupted" });
				onFailure();
			});

			pending.add(work);

			void work.finally(() => {
				pending.delete(work);
			});
		},
		{ noAck: false },
	);

	return {
		async cancel() {
			stopping = true;
			if (active) {
				try {
					await channel.cancel(consumerTag);
				} catch {
					if (active) throw new Error("Email consumer cancellation failed");
				}
			}
		},

		async drain() {
			await Promise.all(pending);
		},
	};
}
