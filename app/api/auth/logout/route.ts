import { NextResponse } from "next/server";
import { clearUserSession } from "@/lib/auth";

export async function POST() {
  try {
    await clearUserSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );
  }
}

