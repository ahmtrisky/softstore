import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Untuk Railway
  experimental: {
    // Enable if needed
  },
};

export default nextConfig;
