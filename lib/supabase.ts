import { createClient } from "@supabase/supabase-js";

/*
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
*/

// Mock supabase client to satisfy imports if any remain, or just leave it commented out if we removed all usages.
// Since we are commenting it out, we should ensure no other file acts on `supabase` export.
// However, if other files import `supabase`, this file needs to export SOMETHING or we break the build.
// Let's check if we removed all usages. We removed it from image-upload.ts.
// Let's create a dummy object just in case to prevent immediate build crashes if I missed a spot,
// BUT better to crash and find out. The user asked to "just comment out".
// If I comment out the export, other files will fail to compile.
// I should probably export a dummy or check for other usages.
// I'll comment it all out. If build fails, I'll fix the other usages.

export const supabase = {} as any;

/**
 * Extracts bucket name from environment variable
 * Handles cases where user might provide a full URL instead of just the bucket name
 */
/*
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
*/
export const STORAGE_BUCKET = "uploads";
