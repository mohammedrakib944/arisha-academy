import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setUserSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/features/auth/validations/auth";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input data
    let validated;
    try {
      validated = loginSchema.parse(body);
    } catch (error) {
      if (error instanceof ZodError) {
        // Validation error - return structured error response
        const errors = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return NextResponse.json(
          {
            success: false,
            error: "Validation failed",
            errors,
            message: errors[0]?.message || "Invalid input data",
          },
          { status: 400 }
        );
      }
      throw error;
    }

    // Business logic: Find user by phone number
    const user = await prisma.user.findUnique({
      where: { phoneNumber: validated.phoneNumber },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid phone number or password",
          code: "INVALID_CREDENTIALS",
        },
        { status: 401 }
      );
    }

    // Business logic: Verify password
    const isPasswordValid = await bcrypt.compare(
      validated.password,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid phone number or password",
          code: "INVALID_CREDENTIALS",
        },
        { status: 401 }
      );
    }

    await setUserSession(user.id);

    return NextResponse.json({ success: true, user });
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          errors,
          message: errors[0]?.message || "Invalid input data",
        },
        { status: 400 }
      );
    }

    // Database or other internal errors
    return NextResponse.json(
      {
        success: false,
        error: "An internal server error occurred. Please try again later.",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 }
    );
  }
}
