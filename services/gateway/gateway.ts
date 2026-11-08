import { ConsoleLogWriter, defineConfig, Logger } from "@graphql-hive/gateway";
import { GraphQLError } from "graphql";

const isDevelopment = process.env.NODE_ENV === "development";

const IDENTITY_ERRORS = new Map([
	["UNAUTHENTICATED", 401],
	["INVALID_CREDENTIALS", 401],
	["EMAIL_ALREADY_REGISTERED", 409],
	["VALIDATION_ERROR", 422],
	["HTTP_ERROR", 400],
]);

const GRAPHQL_ERRORS = new Set([
	"GRAPHQL_PARSE_FAILED",
	"GRAPHQL_VALIDATION_FAILED",
	"BAD_USER_INPUT",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

const writer = new ConsoleLogWriter();

const logging = new Logger({
	writers: [
		{
			write(level, attributes, message) {
				if (
					level !== "error" ||
					!isRecord(attributes) ||
					!(
						"path" in attributes ||
						"locations" in attributes ||
						"extensions" in attributes
					)
				) {
					return writer.write(level, attributes, message);
				}

				// Yoga logs original GraphQL errors automatically; omit their payloads.
				const extensions = isRecord(attributes.extensions)
					? attributes.extensions
					: {};

				const response = isRecord(extensions.response)
					? extensions.response
					: {};

				return writer.write(
					level,
					{
						code: extensions.code,
						service: extensions.serviceName,
						status: response.status,
						path: attributes.path,
					},
					"GraphQL request failed",
				);
			},
		},
	],
});

export const gatewayConfig = defineConfig({
	logging,
	maskedErrors: {
		isDev: isDevelopment,
		maskError(error) {
			if (isDevelopment && error instanceof Error) {
				return error;
			}

			const original = error instanceof GraphQLError ? error : undefined;
			const extensions = original?.extensions ?? {};
			const response = isRecord(extensions.response) ? extensions.response : {};
			const body = isRecord(response.body) ? response.body : {};
			const status =
				typeof body.code === "string"
					? IDENTITY_ERRORS.get(body.code)
					: undefined;
			const publicExtensions: Record<string, unknown> = {
				code: "INTERNAL_SERVER_ERROR",
			};
			let message = "Internal server error";

			if (
				extensions.code === "DOWNSTREAM_SERVICE_ERROR" &&
				extensions.serviceName === "Identity" &&
				status !== undefined &&
				status === response.status &&
				typeof body.code === "string" &&
				typeof body.message === "string"
			) {
				publicExtensions.code = body.code;
				message = body.message;
				if (body.code === "VALIDATION_ERROR" && Array.isArray(body.issues)) {
					publicExtensions.issues = body.issues
						.filter(
							(issue) =>
								isRecord(issue) &&
								Array.isArray(issue.location) &&
								issue.location.every(
									(part) =>
										typeof part === "string" || typeof part === "number",
								) &&
								typeof issue.code === "string" &&
								typeof issue.message === "string",
						)
						.map(({ location, code, message }) => ({
							location,
							code,
							message,
						}));
				}
			} else if (
				typeof extensions.code === "string" &&
				GRAPHQL_ERRORS.has(extensions.code)
			) {
				publicExtensions.code = extensions.code;
				message = original?.message ?? message;
			}

			return new GraphQLError(message, {
				nodes: original?.nodes,
				source: original?.source,
				positions: original?.positions,
				path: original?.path,
				extensions: publicExtensions,
			});
		},
	},
});
