import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (status !== "APPROVED" && status !== "REJECTED") {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    const transaction = await prisma.transaction.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    // Update transaction
    await prisma.transaction.update({
      where: { id: params.id },
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

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update transaction" },
      { status: 500 }
    );
  }
}

