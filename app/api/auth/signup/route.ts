import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { setUserSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/features/auth/validations/auth";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input data
    let validated;
    try {
      validated = signupSchema.parse(body);
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

    // Business logic: Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber: validated.phoneNumber },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error:
            "User with this phone number already exists. Please login instead.",
          code: "USER_ALREADY_EXISTS",
        },
        { status: 409 } // Conflict status
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validated.password, 10);

    // Generate username from first name and last name
    const username = `${validated.firstName} ${validated.lastName}`.trim();

    // Create new user
    const user = await prisma.user.create({
      data: {
        firstName: validated.firstName,
        lastName: validated.lastName,
        username,
        phoneNumber: validated.phoneNumber,
        password: hashedPassword,
      },
    });

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
