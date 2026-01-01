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

const supabaseDomain = getSupabaseStorageDomain();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseDomain
      ? [
          {
            protocol: "https",
            hostname: supabaseDomain,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
    unoptimized: process.env.NODE_ENV === "production",
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
