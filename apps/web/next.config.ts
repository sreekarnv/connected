import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  experimental: {
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
