"use server";

import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { transactionSchema, type TransactionFormData } from "@/features/transactions/validations/transaction";
import { revalidatePath } from "next/cache";

export async function submitTransaction(data: TransactionFormData | FormData) {
  try {
    let validated: TransactionFormData;

    if (data instanceof FormData) {
      // Handle FormData from book purchase form
      const transactionId = data.get("transactionId") as string;
      const phoneNumber = data.get("phoneNumber") as string;
      const bookId = data.get("bookId") as string;
      const courseId = data.get("courseId") as string | null;

      validated = transactionSchema.parse({
        transactionId,
        phoneNumber,
        bookId: bookId || undefined,
        courseId: courseId || undefined,
      });
    } else {
      validated = transactionSchema.parse(data);
    }

    // Check if transactionId already exists
    const existingTransaction = await prisma.transaction.findUnique({
      where: { transactionId: validated.transactionId },
    });

    if (existingTransaction) {
      return { success: false, error: "Transaction ID already used" };
    }

    // Find or get user
    let user = await prisma.user.findUnique({
      where: { phoneNumber: validated.phoneNumber },
    });

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

    // If user exists, create enrollment or purchase
    if (user) {
      if (validated.courseId) {
        await prisma.enrollment.upsert({
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
      }

      if (validated.bookId) {
        await prisma.purchase.upsert({
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
      }
    }

    revalidatePath("/profile");
    revalidatePath("/admin");

    return { success: true, transaction };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to submit transaction" };
  }
}

export async function getTransactions() {
  if (!(await isAdmin())) {
    return [];
  }

  return prisma.transaction.findMany({
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateTransactionStatus(
  id: string,
  status: "APPROVED" | "REJECTED"
) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" };
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!transaction) {
      return { success: false, error: "Transaction not found" };
    }

    // Update transaction
    await prisma.transaction.update({
      where: { id },
      data: { status },
    });

    // Update enrollment or purchase status if user exists
    if (transaction.userId) {
      if (transaction.courseId) {
        await prisma.enrollment.updateMany({
          where: {
            userId: transaction.userId,
            courseId: transaction.courseId,
          },
          data: {
            status: status === "APPROVED" ? "APPROVED" : "REJECTED",
          },
        });
      }

      if (transaction.bookId) {
        await prisma.purchase.updateMany({
          where: {
            userId: transaction.userId,
            bookId: transaction.bookId,
          },
          data: {
            status: status === "APPROVED" ? "APPROVED" : "REJECTED",
          },
        });
      }
    }

    revalidatePath("/admin");
    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update transaction" };
  }
}

