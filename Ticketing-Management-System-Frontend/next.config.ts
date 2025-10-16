import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "*",
      },
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false, // temporary redirect
      },
    ];
  },

  reactStrictMode: false,

  // 🚀 This disables ESLint during production build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
