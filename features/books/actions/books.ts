"use server";

import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { uploadThumbnail } from "@/lib/image-upload";
import { bookSchema, type BookFormData } from "@/features/books/validations/book";
import { revalidatePath } from "next/cache";

export async function createBook(data: BookFormData) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = bookSchema.parse(data);

    let thumbnailUrl: string | undefined;

    if (validated.thumbnail && validated.thumbnail.size > 0) {
      thumbnailUrl = await uploadThumbnail(validated.thumbnail);
    }

    const book = await prisma.book.create({
      data: {
        title: validated.title,
        description: validated.description,
        price: validated.price,
        thumbnail: thumbnailUrl,
      },
    });

    revalidatePath("/admin/books");
    revalidatePath("/books");

    return { success: true, book };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create book" };
  }
}

export async function updateBook(id: string, data: BookFormData) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = bookSchema.parse(data);

    const existingBook = await prisma.book.findUnique({
      where: { id },
    });

    if (!existingBook) {
      return { success: false, error: "Book not found" };
    }

    let thumbnailUrl = existingBook.thumbnail;

    if (validated.thumbnail && validated.thumbnail.size > 0) {
      thumbnailUrl = await uploadThumbnail(validated.thumbnail);
    }

    const book = await prisma.book.update({
      where: { id },
      data: {
        title: validated.title,
        description: validated.description,
        price: validated.price,
        thumbnail: thumbnailUrl,
      },
    });

    revalidatePath("/admin/books");
    revalidatePath(`/books/${id}`);
    revalidatePath("/books");

    return { success: true, book };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update book" };
  }
}

export async function deleteBook(id: string) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.book.delete({
      where: { id },
    });

    revalidatePath("/admin/books");
    revalidatePath("/books");

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete book" };
  }
}

export async function getBooks() {
  return prisma.book.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getBook(id: string) {
  return prisma.book.findUnique({
    where: { id },
  });
}

