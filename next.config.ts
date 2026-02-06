import type { NextConfig } from "next";

// Extract Supabase storage domain from the Supabase URL
const getSupabaseStorageDomain = (): string | null => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;

  try {
    const url = new URL(supabaseUrl);
    return url.hostname;
  } catch {
    return null;
  }
};

const getMinioConfig = () => {
  const minioEndpoint = process.env.NEXT_PUBLIC_MINIO_ENDPOINT;
  if (!minioEndpoint) return null;
  try {
    const url = new URL(minioEndpoint);
    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port,
    };
  } catch {
    return null;
  }
};

const supabaseDomain = getSupabaseStorageDomain();
const minioConfig = getMinioConfig();

// @ts-ignore - types might be slightly off for remotePatterns in some next versions but this structure is standard
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(supabaseDomain
        ? [
          {
            protocol: "https",
            hostname: supabaseDomain,
            pathname: "/storage/v1/object/public/**",
          },
        ]
        : []),
      ...(minioConfig
        ? [
          {
            protocol: minioConfig.protocol,
            hostname: minioConfig.hostname,
            port: minioConfig.port,
            pathname: `/${process.env.MINIO_BUCKET || "uploads"}/**`,
          },
        ]
        : []),
      {
        protocol: "https",
        hostname: "rcmfzyjsjieofxijolbd.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "storage.arishaacademy.com",
        port: "443",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "159.223.89.58",
        port: "9000",
        pathname: "/uploads/**",
      },
    ] as any[], // Explicit cast to any[] to avoid strict type checking issues with conditional spreads of different shapes
    unoptimized: process.env.NODE_ENV === "production",
  },
  // @ts-ignore
  serverActions: {
    bodySizeLimit: "10mb",
  },
};

export default nextConfig;
