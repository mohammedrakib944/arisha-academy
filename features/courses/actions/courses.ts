"use server";

import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import { uploadThumbnail, uploadRoutineImage } from "@/lib/image-upload";
import { courseSchema, type CourseFormData } from "@/features/courses/validations/course";
import { revalidatePath } from "next/cache";

export async function createCourse(data: CourseFormData) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = courseSchema.parse(data);

    let thumbnailUrl: string | undefined;
    let routineImageUrl: string | undefined;

    if (validated.thumbnail && validated.thumbnail.size > 0) {
      thumbnailUrl = await uploadThumbnail(validated.thumbnail);
    }

    if (validated.routineImage && validated.routineImage.size > 0) {
      routineImageUrl = await uploadRoutineImage(validated.routineImage);
    }

    const course = await prisma.course.create({
      data: {
        title: validated.title,
        description: validated.description,
        price: validated.price,
        totalClasses: validated.totalClasses,
        totalExams: validated.totalExams,
        overview: validated.overview,
        courseOutlineUrl: validated.courseOutlineUrl || undefined,
        thumbnail: thumbnailUrl,
        routineImage: routineImageUrl,
        teachers: {
          create: validated.teacherIds.map((teacherId) => ({
            teacherId,
          })),
        },
        subjects: {
          create: validated.subjects.map((subject) => ({
            name: subject.name,
            lessons: {
              create: subject.lessons.map((lesson) => ({
                title: lesson.title,
                description: lesson.description,
              })),
            },
          })),
        },
      },
      include: {
        teachers: {
          include: { teacher: true },
        },
        subjects: {
          include: { lessons: true },
        },
      },
    });

    revalidatePath("/admin/courses");
    revalidatePath("/courses");

    return { success: true, course };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to create course" };
  }
}

export async function updateCourse(id: string, data: CourseFormData) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" };
    }

    const validated = courseSchema.parse(data);

    const existingCourse = await prisma.course.findUnique({
      where: { id },
      include: { teachers: true, subjects: true },
    });

    if (!existingCourse) {
      return { success: false, error: "Course not found" };
    }

    let thumbnailUrl = existingCourse.thumbnail;
    let routineImageUrl = existingCourse.routineImage;

    if (validated.thumbnail && validated.thumbnail.size > 0) {
      thumbnailUrl = await uploadThumbnail(validated.thumbnail);
    }

    if (validated.routineImage && validated.routineImage.size > 0) {
      routineImageUrl = await uploadRoutineImage(validated.routineImage);
    }

    // Delete existing relations
    await prisma.courseTeacher.deleteMany({
      where: { courseId: id },
    });

    await prisma.courseSubject.deleteMany({
      where: { courseId: id },
    });

    const course = await prisma.course.update({
      where: { id },
      data: {
        title: validated.title,
        description: validated.description,
        price: validated.price,
        totalClasses: validated.totalClasses,
        totalExams: validated.totalExams,
        overview: validated.overview,
        courseOutlineUrl: validated.courseOutlineUrl || undefined,
        thumbnail: thumbnailUrl,
        routineImage: routineImageUrl,
        teachers: {
          create: validated.teacherIds.map((teacherId) => ({
            teacherId,
          })),
        },
        subjects: {
          create: validated.subjects.map((subject) => ({
            name: subject.name,
            lessons: {
              create: subject.lessons.map((lesson) => ({
                title: lesson.title,
                description: lesson.description,
              })),
            },
          })),
        },
      },
      include: {
        teachers: {
          include: { teacher: true },
        },
        subjects: {
          include: { lessons: true },
        },
      },
    });

    revalidatePath("/admin/courses");
    revalidatePath(`/courses/${id}`);
    revalidatePath("/courses");

    return { success: true, course };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Failed to update course" };
  }
}

export async function deleteCourse(id: string) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.course.delete({
      where: { id },
    });

    revalidatePath("/admin/courses");
    revalidatePath("/courses");

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete course" };
  }
}

export async function getCourses() {
  return prisma.course.findMany({
    include: {
      teachers: {
        include: { teacher: true },
      },
      subjects: {
        include: { lessons: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCourse(id: string) {
  return prisma.course.findUnique({
    where: { id },
    include: {
      teachers: {
        include: { teacher: true },
      },
      subjects: {
        include: { lessons: true },
      },
    },
  });
}

