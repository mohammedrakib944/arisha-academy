import { supabase, STORAGE_BUCKET } from "@/lib/supabase";

/**
 * Utility function to check Supabase Storage bucket configuration
 * This can be called from a server action or API route for debugging
 */
export async function checkSupabaseBucket() {
  const results = {
    configuredBucket: STORAGE_BUCKET,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    availableBuckets: [] as Array<{
      name: string;
      public: boolean;
      id: string;
    }>,
    bucketExists: false,
    bucketIsPublic: false,
    errors: [] as string[],
  };

  try {
    // Check if Supabase URL is set
    if (!results.supabaseUrl) {
      results.errors.push("NEXT_PUBLIC_SUPABASE_URL is not set");
      return results;
    }

    // Check if service key is set
    if (!results.hasServiceKey) {
      results.errors.push("SUPABASE_SERVICE_ROLE_KEY is not set");
      return results;
    }

    // List all available buckets
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) {
      results.errors.push(`Failed to list buckets: ${listError.message}`);
      return results;
    }

    if (buckets) {
      results.availableBuckets = buckets.map((bucket) => ({
        name: bucket.name,
        public: bucket.public,
        id: bucket.id,
      }));

      // Check if configured bucket exists
      const foundBucket = buckets.find(
        (bucket) => bucket.name === STORAGE_BUCKET
      );
      if (foundBucket) {
        results.bucketExists = true;
        results.bucketIsPublic = foundBucket.public;
      } else {
        results.errors.push(
          `Bucket "${STORAGE_BUCKET}" not found. Available buckets: ${
            buckets.map((b) => b.name).join(", ") || "none"
          }`
        );
      }
    } else {
      results.errors.push("No buckets found in your Supabase project");
    }
  } catch (error) {
    results.errors.push(
      `Unexpected error: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  return results;
}
