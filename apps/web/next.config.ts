import type { NextConfig } from "next";

if (process.env.ENVIRONMENT === "production") {
  const address = process.env.NEXT_PUBLIC_GATEWAY_URL;
  const gateway =
    address && URL.canParse(address) ? new URL(address) : undefined;

  if (
    !gateway ||
    gateway.protocol !== "https:" ||
    gateway.username ||
    gateway.password ||
    gateway.pathname !== "/graphql" ||
    gateway.search ||
    gateway.hash
  ) {
    throw new Error(
      "Production builds require NEXT_PUBLIC_GATEWAY_URL as an HTTPS /graphql URL without credentials",
    );
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  devIndicators: false,
  experimental: {
    agentUpgrade: "security",
    optimizePackageImports: ["@chakra-ui/react"],
  },
  async headers() {
    return [
      "/forgot-password",
      "/reset-password",
      "/verify-email",
      "/resend-verification",
    ].map((source) => ({
      source,
      headers: [
        { key: "Cache-Control", value: "no-store" },
        { key: "Referrer-Policy", value: "no-referrer" },
      ],
    }));
  },
  allowedDevOrigins: ["192.168.0.111"],
};

export default nextConfig;
