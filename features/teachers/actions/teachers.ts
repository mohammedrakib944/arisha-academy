"use server";

import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { uploadTeacherImage, deleteImageFile } from "@/lib/image-upload";
import { teacherSchema, type TeacherFormData } from "@/features/teachers/validations/teacher";
import { revalidatePath } from "next/cache";

export async function createTeacher(data: TeacherFormData) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = teacherSchema.parse(data);

    let imageUrl: string | undefined;

    if (validated.image && validated.image.size > 0) {
      imageUrl = await uploadTeacherImage(validated.image);
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

export async function updateTeacher(id: string, data: TeacherFormData) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = teacherSchema.parse(data);

    const existingTeacher = await prisma.teacher.findUnique({
      where: { id },
    });

    if (!existingTeacher) {
      return { success: false, error: "Teacher not found" };
    }

    let imageUrl = existingTeacher.image;

    if (validated.image && validated.image.size > 0) {
      // Delete old image if it exists
      if (existingTeacher.image) {
        await deleteImageFile(existingTeacher.image);
      }
      imageUrl = await uploadTeacherImage(validated.image);
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
  return prisma.teacher.findMany({
    orderBy: { createdAt: "desc" },
  });
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

