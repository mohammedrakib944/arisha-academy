"use server";

import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { uploadThumbnail, deleteImageFile } from "@/lib/image-upload";
import { bookInputSchema } from "@/features/books/validations/book";
import { revalidatePath } from "next/cache";

// Helper to create a FileList-like object from a File
function createFileList(file: File): FileList {
  return {
    length: 1,
    item: (index: number) => (index === 0 ? file : null),
    0: file,
    [Symbol.iterator]: function* () {
      yield file;
    },
  } as FileList;
}

export async function createBook(formData: FormData) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" };
    }

    // Extract data from FormData
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const priceStr = formData.get("price") as string;
    const thumbnail = formData.get("thumbnail") as File | null;

    const price = priceStr ? parseFloat(priceStr) : 0;

    // Validate the data
    const validated = bookInputSchema.parse({
      title,
      description: description || undefined,
      price,
      thumbnail: thumbnail ? createFileList(thumbnail) : undefined,
    });

    let thumbnailUrl: string | undefined;

    if (thumbnail && thumbnail.size > 0) {
      thumbnailUrl = await uploadThumbnail(thumbnail);
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

export async function updateBook(id: string, formData: FormData) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" };
    }

    // Extract data from FormData
    const title = formData.get("title") as string;
    const description = formData.get("description") as string | null;
    const priceStr = formData.get("price") as string;
    const thumbnail = formData.get("thumbnail") as File | null;

    const price = priceStr ? parseFloat(priceStr) : 0;

    // Validate the data
    const validated = bookInputSchema.parse({
      title,
      description: description || undefined,
      price,
      thumbnail: thumbnail ? createFileList(thumbnail) : undefined,
    });

    const existingBook = await prisma.book.findUnique({
      where: { id },
    });

    if (!existingBook) {
      return { success: false, error: "Book not found" };
    }

    let thumbnailUrl = existingBook.thumbnail;

    if (thumbnail && thumbnail.size > 0) {
      // Delete old thumbnail if it exists
      if (existingBook.thumbnail) {
        await deleteImageFile(existingBook.thumbnail);
      }
      thumbnailUrl = await uploadThumbnail(thumbnail);
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

    // Get the book to access image path before deletion
    const book = await prisma.book.findUnique({
      where: { id },
      select: { thumbnail: true },
    });

    // Delete the book from database
    await prisma.book.delete({
      where: { id },
    });

    // Delete associated image file
    if (book) {
      await deleteImageFile(book.thumbnail);
    }

    revalidatePath("/admin/books");
    revalidatePath("/books");

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete book" };
  }
}

export async function getBooks() {
  try {
    return await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    // Return empty array on error to prevent app crash
    return [];
  }
}

export async function getBook(id: string) {
  try {
    return await prisma.book.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error(`Error fetching book ${id}:`, error);
    // Return null on error - page will handle with notFound()
    return null;
  }
}
