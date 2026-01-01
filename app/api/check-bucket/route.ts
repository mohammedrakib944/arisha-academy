import { checkSupabaseBucket } from "@/lib/check-supabase-bucket";
import { NextResponse } from "next/server";

/**
 * API route to check Supabase bucket configuration
 * Visit: http://localhost:3000/api/check-bucket
 */
export async function GET() {
  try {
    const results = await checkSupabaseBucket();
    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to check bucket",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
