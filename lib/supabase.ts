import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

if (!supabaseServiceKey) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

/**
 * Extracts bucket name from environment variable
 * Handles cases where user might provide a full URL instead of just the bucket name
 */
function getBucketName(): string {
  const bucketEnv = process.env.SUPABASE_STORAGE_BUCKET || "uploads";

  // If it's a URL, extract the bucket name
  if (bucketEnv.includes("http://") || bucketEnv.includes("https://")) {
    try {
      const url = new URL(bucketEnv);
      // Extract bucket name from URL path
      // Format: https://...storage.supabase.co/storage/v1/s3/[bucket-name]
      const pathParts = url.pathname.split("/").filter(Boolean);
      const s3Index = pathParts.indexOf("s3");
      if (s3Index !== -1 && pathParts[s3Index + 1]) {
        return pathParts[s3Index + 1];
      }
      // Fallback: try to extract from last path segment
      const lastPart = pathParts[pathParts.length - 1];
      if (lastPart && lastPart !== "s3") {
        return lastPart;
      }
    } catch {
      // If URL parsing fails, return as-is (will show error later)
    }
  }

  return bucketEnv;
}

export const STORAGE_BUCKET = getBucketName();
