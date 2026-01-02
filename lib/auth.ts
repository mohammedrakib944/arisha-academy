"use server";

import { prisma } from "./prisma";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    // Return null on error to prevent app crash
    return null;
  }
}

export async function isAdmin() {
  try {
    const user = await getCurrentUser();
    return user?.role === "ADMIN";
  } catch (error) {
    console.error("Error checking admin status:", error);
    // Return false on error to prevent unauthorized access
    return false;
  }
}

export async function setUserSession(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set("userId", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
}
