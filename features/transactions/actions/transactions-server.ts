"use server";

import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";

export async function getTransactionsServer() {
  try {
    if (!(await isAdmin())) {
      return [];
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

    return transactionsWithDetails;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

