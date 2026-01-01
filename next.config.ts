import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    // Disable Next.js image optimization in production
    // Uploaded images are already optimized by Sharp, and this prevents
    // "received null" errors when Next.js tries to optimize local uploads
    unoptimized: process.env.NODE_ENV === "production",
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
