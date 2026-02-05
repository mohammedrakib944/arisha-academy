"use server";

import { prisma } from "./prisma";
import { cookies } from "next/headers";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    console.log("[Auth Debug] getCurrentUser called. userId in cookie:", userId);

    if (!userId) {
      console.log("[Auth Debug] No userId in cookie, returning null");
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    console.log("[Auth Debug] User found in Prisma:", user ? "Yes" : "No", user?.phoneNumber);

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
  const isSecure = false; // Set to false to support HTTP servers. Change back to process.env.NODE_ENV === "production" when SSL is enabled.
  console.log("[Auth Debug] setSession called for userId:", userId, "Secure:", isSecure);
  cookieStore.set("userId", userId, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete("userId");
}
