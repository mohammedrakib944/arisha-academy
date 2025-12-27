"use server";

import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { uploadTeacherImage, deleteImageFile } from "@/lib/image-upload";
import { teacherInputSchema } from "@/features/teachers/validations/teacher";
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

export async function createTeacher(formData: FormData) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" };
    }

    // Extract data from FormData
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string | null;
    const subjectsJson = formData.get("subjects") as string;
    const image = formData.get("image") as File | null;

    const subjects = subjectsJson ? JSON.parse(subjectsJson) : [];

    // Validate the data
    const validated = teacherInputSchema.parse({
      name,
      bio: bio || undefined,
      subjects,
      image: image ? createFileList(image) : undefined,
    });

    let imageUrl: string | undefined;

    if (image && image.size > 0) {
      imageUrl = await uploadTeacherImage(image);
    }

    const teacher = await prisma.teacher.create({
      data: {
        name: validated.name,
        bio: validated.bio,
        subjects: validated.subjects,
        image: imageUrl,
      },
    });

    revalidatePath("/admin/teachers");
    revalidatePath("/teachers");

    return { success: true, teacher };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create teacher" };
  }
}

export async function updateTeacher(id: string, formData: FormData) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" };
    }

    // Extract data from FormData
    const name = formData.get("name") as string;
    const bio = formData.get("bio") as string | null;
    const subjectsJson = formData.get("subjects") as string;
    const image = formData.get("image") as File | null;

    const subjects = subjectsJson ? JSON.parse(subjectsJson) : [];

    // Validate the data
    const validated = teacherInputSchema.parse({
      name,
      bio: bio || undefined,
      subjects,
      image: image ? createFileList(image) : undefined,
    });

    const existingTeacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!existingTeacher) {
      return { success: false, error: "Teacher not found" };
    }

    let imageUrl = existingTeacher.image;

    if (image && image.size > 0) {
      // Delete old image if it exists
      if (existingTeacher.image) {
        await deleteImageFile(existingTeacher.image);
      }
      imageUrl = await uploadTeacherImage(image);
    }

    const teacher = await prisma.teacher.update({
      where: { id },
      data: {
        name: validated.name,
        bio: validated.bio,
        subjects: validated.subjects,
        image: imageUrl,
      },
    });

    revalidatePath("/admin/teachers");
    revalidatePath(`/teachers/${id}`);
    revalidatePath("/teachers");

    return { success: true, teacher };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update teacher" };
  }
}

export async function deleteTeacher(id: string) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" };
    }

    // Get the teacher to access image path before deletion
    const teacher = await prisma.teacher.findUnique({
      where: { id },
      select: { image: true },
    });

    // Delete the teacher from database
    await prisma.teacher.delete({
      where: { id },
    });

    // Delete associated image file
    if (teacher) {
      await deleteImageFile(teacher.image);
    }

    revalidatePath("/admin/teachers");
    revalidatePath("/teachers");

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete teacher" };
  }
}

export async function getTeachers() {
  try {
    return await prisma.teacher.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    // Return empty array on error instead of throwing
    return [];
  }
}

export async function getTeacher(id: string) {
  return prisma.teacher.findUnique({
    where: { id },
    include: {
      courses: {
        include: { course: true },
      },
    },
  });
}
