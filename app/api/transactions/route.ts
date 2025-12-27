import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin, getCurrentUser } from "@/lib/auth";
import {
  transactionSchema,
  type TransactionFormData,
} from "@/features/transactions/validations/transaction";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input data
    let validated;
    try {
      validated = transactionSchema.parse(body);
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

    // Check if transactionId already exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: { transactionId: validated.transactionId },
    });

    if (existingTransaction) {
      return NextResponse.json(
        {
          success: false,
          error: "Transaction ID already used",
          code: "DUPLICATE_TRANSACTION",
        },
        { status: 409 } // Conflict status
      );
    }

    // Try to get current logged-in user first
    let user = await getCurrentUser();

    // If no logged-in user, try to find by phone number (use normalized version)
    if (!user) {
      // Phone number is already normalized by the validation schema
      user = await prisma.user.findUnique({
        where: { phoneNumber: validated.phoneNumber },
      });
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        transactionId: validated.transactionId,
        phoneNumber: validated.phoneNumber,
        userId: user?.id,
        courseId: validated.courseId,
        bookId: validated.bookId,
        status: "PENDING",
      },
    });

    console.log("Transaction created:", transaction.id);

    // If user exists, create enrollment or purchase
    if (user) {
      if (validated.courseId) {
        try {
          const enrollment = await prisma.enrollment.upsert({
            where: {
              userId_courseId: {
                userId: user.id,
                courseId: validated.courseId,
              },
            },
            create: {
              userId: user.id,
              courseId: validated.courseId,
              status: "PENDING",
            },
            update: {},
          });
          console.log("Enrollment created/updated:", enrollment.id);
        } catch (error) {
          console.error("Error creating enrollment:", error);
        }
      }

      if (validated.bookId) {
        try {
          const purchase = await prisma.purchase.upsert({
            where: {
              userId_bookId: {
                userId: user.id,
                bookId: validated.bookId,
              },
            },
            create: {
              userId: user.id,
              bookId: validated.bookId,
              status: "PENDING",
            },
            update: {},
          });
          console.log("Purchase created/updated:", purchase.id);
        } catch (error) {
          console.error("Error creating purchase:", error);
        }
      }
    } else {
      console.log("No user found - enrollment/purchase not created");
    }

    revalidatePath("/profile");
    revalidatePath("/admin");

    return NextResponse.json({ success: true, transaction });
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

export async function GET(request: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json([], { status: 200 });
    }

    const transactions = await prisma.transaction.findMany({
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch course and book details for each transaction
    const transactionsWithDetails = await Promise.all(
      transactions.map(async (transaction) => {
        let course = null;
        let book = null;

        if (transaction.courseId) {
          course = await prisma.course.findUnique({
            where: { id: transaction.courseId },
            select: { id: true, title: true },
          });
        }

        if (transaction.bookId) {
          book = await prisma.book.findUnique({
            where: { id: transaction.bookId },
            select: { id: true, title: true },
          });
        }

        return {
          ...transaction,
          course,
          book,
        };
      })
    );

    return NextResponse.json(transactionsWithDetails);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
