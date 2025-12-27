"use server";

import { prisma } from "@/lib/prisma";
import { setUserSession } from "@/lib/auth";
import {
  authSchema,
  type AuthFormData,
} from "@/features/auth/validations/auth";

export async function loginOrSignup(data: AuthFormData) {
  try {
    const validated = authSchema.parse(data);

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { phoneNumber: validated.phoneNumber },
    });

    // If user doesn't exist, create new user
    if (!user) {
      user = await prisma.user.create({
        data: {
          username: validated.username,
          phoneNumber: validated.phoneNumber,
        },
      });
    } else {
      // Update username if it changed
      if (user.username !== validated.username) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { username: validated.username },
        });
      }
    }

    await setUserSession(user.id);

    return { success: true, user };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Authentication failed" };
  }
}

export async function logout(_formData?: FormData) {
  const { clearUserSession } = await import("@/lib/auth");
  await clearUserSession();
}
