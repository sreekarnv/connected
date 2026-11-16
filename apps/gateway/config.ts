import { resolve } from "node:path";

export function isProduction(env = process.env): boolean {
  if (
    env.ENVIRONMENT &&
    !["development", "test", "production"].includes(env.ENVIRONMENT)
  ) {
    throw new Error("ENVIRONMENT must be development, test, or production");
  }
  return env.ENVIRONMENT === "production" || env.NODE_ENV === "production";
}

export function serviceOptions(
  service: string,
  port: number,
  env = process.env,
) {
  const name = `${service.toUpperCase()}_URL`;
  const endpoint = env[name] ?? `http://localhost:${port}`;
  let url: URL;
  try {
    url = new URL(endpoint);
  } catch {
    throw new Error(`${name} must be an HTTP(S) origin`);
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.origin !== endpoint ||
    url.username ||
    url.password ||
    url.port === "0"
  ) {
    throw new Error(`${name} must be an HTTP(S) origin without credentials`);
  }
  if (
    isProduction(env) &&
    (!env[name] ||
      !env.OPENAPI_DIR ||
      /(^localhost$|\.localhost$|^127\.|^0\.0\.0\.0$|^\[::1\]$|^\[::\]$)/.test(
        url.hostname,
      ))
  ) {
    throw new Error(
      `Production composition requires OPENAPI_DIR and a non-loopback ${name}`,
    );
  }
  return {
    source: env.OPENAPI_DIR
      ? resolve(env.OPENAPI_DIR, `${service}.json`)
      : `${endpoint}/openapi.json`,
    endpoint,
    ignoreErrorResponses: true,
    operationHeaders: { Authorization: "{context.headers.authorization}" },
  };
}

export function getCorsOrigins(env = process.env): string[] {
  let origins: unknown;
  try {
    origins = JSON.parse(
      env.CORS_ORIGINS ??
        '["http://localhost:3000","http://127.0.0.1:3000","http://localhost:4000","http://127.0.0.1:4000"]',
    );
  } catch {
    throw new Error(
      "CORS_ORIGINS must be a JSON array of exact HTTP(S) origins",
    );
  }
  if (
    !Array.isArray(origins) ||
    !origins.every(
      (origin: unknown): origin is string =>
        typeof origin === "string" &&
        !origin.includes("*") &&
        URL.canParse(origin) &&
        ["http:", "https:"].includes(new URL(origin).protocol) &&
        new URL(origin).origin === origin &&
        new URL(origin).port !== "0",
    )
  ) {
    throw new Error(
      "CORS_ORIGINS must be a JSON array of exact HTTP(S) origins",
    );
  }
  if (
    isProduction(env) &&
    (!env.CORS_ORIGINS ||
      !origins.length ||
      origins.some((origin) => !origin.startsWith("https://")))
  ) {
    throw new Error("Production requires explicit HTTPS CORS_ORIGINS");
  }
  return origins;
}
