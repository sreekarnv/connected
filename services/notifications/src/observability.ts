import { Counter, Histogram, Registry } from "@prometheus-io/client";

export const registry = new Registry();
registry.setDefaultLabels({ service: "notifications" });

export const requests = new Counter({
	name: "http_requests_total",
	help: "Completed HTTP requests",
	labelNames: ["method", "route", "status"],
	registers: [registry],
});

export const duration = new Histogram({
	name: "http_request_duration_seconds",
	help: "HTTP request duration in seconds",
	labelNames: ["method", "route"],
	registers: [registry],
});

export const deliveries = new Counter({
	name: "email_deliveries_total",
	help: "Email processing outcomes",
	labelNames: ["queue", "outcome"],
	registers: [registry],
});

export function log(
	level: "info" | "error",
	event: string,
	fields: Record<string, string | number> = {},
) {
	console.log(
		JSON.stringify({
			timestamp: new Date().toISOString(),
			level,
			service: "notifications",
			event,
			...fields,
		}),
	);
}
