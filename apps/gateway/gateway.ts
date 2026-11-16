import {
  ConsoleLogWriter,
  defineConfig,
  type GatewayContext,
  type GatewayPlugin,
  Logger,
  usePropagateHeaders,
} from "@graphql-hive/gateway";
import {
  defaultFieldResolver,
  GraphQLError,
  type GraphQLSchema,
  type GraphQLResolveInfo,
  Kind,
} from "graphql";
import { getCorsOrigins, isProduction } from "./config.ts";
import { additionalTypeDefs } from "./schema.ts";

type PostPage = { items: ({ author_id: string } | null)[] };
type SocialContext = {
  Social: {
    Query: {
      socialProfilesByIds(options: {
        root: PostPage;
        args: { ids: string[] };
        context: GatewayContext & SocialContext;
        info: GraphQLResolveInfo;
      }): Promise<unknown>;
    };
  };
};

const production = isProduction();
const isDevelopment = !production && process.env.NODE_ENV === "development";
const corsOrigins = getCorsOrigins();

const DOWNSTREAM_ERRORS = new Map([
  [
    "Content",
    new Map([
      ["UNAUTHENTICATED", 401],
      ["FORBIDDEN", 403],
      ["IDENTITY_UNAVAILABLE", 503],
      ["SOCIAL_UNAVAILABLE", 503],
      ["DATABASE_UNAVAILABLE", 503],
      ["PROFILE_NOT_FOUND", 404],
      ["POST_NOT_FOUND", 404],
      ["VALIDATION_ERROR", 422],
      ["HTTP_ERROR", 400],
    ]),
  ],
  [
    "Identity",
    new Map([
      ["UNAUTHENTICATED", 401],
      ["INVALID_CREDENTIALS", 401],
      ["EMAIL_NOT_VERIFIED", 403],
      ["INVALID_EMAIL_VERIFICATION_TOKEN", 400],
      ["INVALID_PASSWORD_RESET_TOKEN", 400],
      ["FORBIDDEN", 403],
      ["EMAIL_ALREADY_REGISTERED", 409],
      ["VALIDATION_ERROR", 422],
      ["HTTP_ERROR", 400],
    ]),
  ],
  [
    "Social",
    new Map([
      ["UNAUTHENTICATED", 401],
      ["FORBIDDEN", 403],
      ["IDENTITY_UNAVAILABLE", 503],
      ["DATABASE_UNAVAILABLE", 503],
      ["PROFILE_NOT_FOUND", 404],
      ["PROFILE_ALREADY_EXISTS", 409],
      ["HANDLE_TAKEN", 409],
      ["SELF_RELATIONSHIP", 422],
      ["VALIDATION_ERROR", 422],
      ["HTTP_ERROR", 400],
    ]),
  ],
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

export const gatewayConfig = defineConfig<SocialContext>({
  logging,
  healthCheckEndpoint: "/livez",
  readinessCheckEndpoint: "/readyz",
  graphiql: !production,
  disableIntrospection: production ? {} : undefined,
  maxDepth: 8,
  maxTokens: 1000,
  blockFieldSuggestions: production,
  batching: false,
  requestTimeout: 10_000,
  requestDeadline: 15_000,
  upstreamTimeout: 5_000,
  gracefulShutdownTimeout: 20_000,
  disableWebsockets: true,
  additionalTypeDefs,
  additionalResolvers: {
    PostPageDto: {
      authors: {
        selectionSet: "{ items { author_id } }",
        resolve(
          page: PostPage,
          _args: unknown,
          context: GatewayContext & SocialContext,
          info: GraphQLResolveInfo,
        ) {
          const ids = [
            ...new Set(
              page.items.flatMap((post) => (post ? [post.author_id] : [])),
            ),
          ];
          if (!ids.length) return [];
          return context.Social.Query.socialProfilesByIds({
            root: page,
            args: { ids },
            context,
            info,
          });
        },
      },
    },
  },
  cors: {
    origin: corsOrigins,
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type", "X-CSRF-Protection"],
  },
  plugins: (): GatewayPlugin[] => [
    usePropagateHeaders({
      fromClientToSubgraphs({ request, subgraphName }) {
        if (subgraphName === "Identity") {
          return {
            Cookie: request.headers.get("Cookie"),
            Origin: request.headers.get("Origin"),
            "X-CSRF-Protection": request.headers.get("X-CSRF-Protection"),
          };
        }
      },
      fromSubgraphsToClient({ response, subgraphName }) {
        if (subgraphName === "Identity") {
          return {
            "set-cookie": response.headers.getSetCookie(),
          };
        }
      },
    }),
    {
      onSchemaChange({ schema }: { schema: GraphQLSchema }) {
        const field = schema.getQueryType()?.getFields().contentPosts;
        if (!field) return;
        const resolve = field.resolve ?? defaultFieldResolver;
        field.resolve = (source, args, context, info) => {
          const authorIds = args.author_ids;
          // The OpenAPI transport omits empty arrays, removing the author filter.
          if (
            Array.isArray(authorIds) &&
            (authorIds.length === 0 ||
              authorIds.length > 50 ||
              authorIds.some((id) => id == null))
          ) {
            throw new GraphQLError("Author IDs must contain 1 to 50 UUIDs", {
              extensions: { code: "BAD_USER_INPUT" },
            });
          }
          return resolve(source, args, context, info);
        };
      },
      onResponse({ response }) {
        response.headers.set("Cache-Control", "no-store");
      },
    },
  ],
  maskedErrors: {
    isDev: isDevelopment,
    maskError(error) {
      const original = error instanceof GraphQLError ? error : undefined;
      const extensions = original?.extensions ?? {};
      if (
        isDevelopment &&
        error instanceof Error &&
        extensions.code !== "DOWNSTREAM_SERVICE_ERROR"
      ) {
        return error;
      }

      const response = isRecord(extensions.response) ? extensions.response : {};
      const body = isRecord(response.body) ? response.body : {};
      const status =
        typeof extensions.serviceName === "string" &&
        typeof body.code === "string"
          ? DOWNSTREAM_ERRORS.get(extensions.serviceName)?.get(body.code)
          : undefined;
      const publicExtensions: Record<string, unknown> = {
        code: "INTERNAL_SERVER_ERROR",
      };
      let message = "Internal server error";

      if (
        extensions.code === "DOWNSTREAM_SERVICE_ERROR" &&
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
        extensions.code === "DOWNSTREAM_SERVICE_ERROR" &&
        original?.originalError instanceof GraphQLError &&
        original.originalError.path === undefined &&
        original.originalError.nodes?.some(
          (node) => node.kind === Kind.VARIABLE_DEFINITION,
        )
      ) {
        publicExtensions.code = "BAD_USER_INPUT";
        message = "Invalid input value";
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
