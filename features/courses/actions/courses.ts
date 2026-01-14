"use server";

import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth";
import {
  uploadThumbnail,
  uploadRoutineImage,
  deleteImageFile,
} from "@/lib/image-upload";
import {
  courseSchema,
  courseFormDataSchema,
  type CourseFormData,
} from "@/features/courses/validations/course";
import { revalidatePath } from "next/cache";

export async function createCourse(data: CourseFormData) {
  try {
    if (!(await isAdmin())) {
      return { success: false, error: "Unauthorized" };
    }

    // Check file sizes before validation
    if (data.thumbnail && data.thumbnail.size > 3 * 1024 * 1024) {
      return {
        success: false,
        error: `Thumbnail file size exceeds 3MB limit. Current size: ${(
          data.thumbnail.size /
          (1024 * 1024)
        ).toFixed(2)}MB`,
      };
    }

    // Validate the data structure (File objects, not FileList)
    const validated = courseFormDataSchema.parse(data);

    let thumbnailUrl: string | undefined;
    const youtubeUrl = validated.youtubeUrl || undefined;

    if (validated.thumbnail && validated.thumbnail.size > 0) {
      thumbnailUrl = await uploadThumbnail(validated.thumbnail);
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
        routineImage: youtubeUrl,
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
      // Check for body size limit errors
      const errorMessage = error.message || "";
      const errorDigest = (error as any).digest || "";

      if (
        errorMessage.includes("Body exceeded") ||
        errorMessage.includes("413") ||
        errorDigest.includes("@E394") ||
        errorMessage.includes("bodySizeLimit")
      ) {
        return {
          success: false,
          error:
            "Total file size exceeds 3MB limit. Please reduce the size of your images and try again.",
        };
      }
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

    // Check file sizes before validation
    if (data.thumbnail && data.thumbnail.size > 3 * 1024 * 1024) {
      return {
        success: false,
        error: `Thumbnail file size exceeds 3MB limit. Current size: ${(
          data.thumbnail.size /
          (1024 * 1024)
        ).toFixed(2)}MB`,
      };
    }

    // Validate the data structure (File objects, not FileList)
    const validated = courseFormDataSchema.parse(data);

    const existingCourse = await prisma.course.findUnique({
      where: { id },
      include: { teachers: true, subjects: true },
    });

    if (!existingCourse) {
      return { success: false, error: "Course not found" };
    }

    let thumbnailUrl = existingCourse.thumbnail;
    const youtubeUrl = validated.youtubeUrl || undefined;

    if (validated.thumbnail && validated.thumbnail.size > 0) {
      // Delete old thumbnail if it exists
      if (existingCourse.thumbnail) {
        await deleteImageFile(existingCourse.thumbnail);
      }
      thumbnailUrl = await uploadThumbnail(validated.thumbnail);
    }

    // Delete old routine image if it exists and was an image file (not a YouTube URL)
    if (
      existingCourse.routineImage &&
      !existingCourse.routineImage.startsWith("http")
    ) {
      await deleteImageFile(existingCourse.routineImage);
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
        routineImage: youtubeUrl,
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
      // Check for body size limit errors
      const errorMessage = error.message || "";
      const errorDigest = (error as any).digest || "";

      if (
        errorMessage.includes("Body exceeded") ||
        errorMessage.includes("413") ||
        errorDigest.includes("@E394") ||
        errorMessage.includes("bodySizeLimit")
      ) {
        return {
          success: false,
          error:
            "Total file size exceeds 3MB limit. Please reduce the size of your images and try again.",
        };
      }
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

    // Get the course to access image paths before deletion
    const course = await prisma.course.findUnique({
      where: { id },
      select: { thumbnail: true, routineImage: true },
    });

    // Delete the course from database
    await prisma.course.delete({
      where: { id },
    });

    // Delete associated image files
    if (course) {
      await deleteImageFile(course.thumbnail);
      // Only delete if it's an image file, not a YouTube URL
      if (course.routineImage && !course.routineImage.startsWith("http")) {
        await deleteImageFile(course.routineImage);
      }
    }

    revalidatePath("/admin/courses");
    revalidatePath("/courses");

    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete course" };
  }
}

export async function getCourses() {
  try {
    return await prisma.course.findMany({
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
  } catch (error) {
    console.error("Error fetching courses:", error);
    // Return empty array on error to prevent app crash
    return [];
  }
}

export async function getCourse(id: string) {
  try {
    return await prisma.course.findUnique({
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
  } catch (error) {
    console.error(`Error fetching course ${id}:`, error);
    // Return null on error - page will handle with notFound()
    return null;
  }
}

export async function checkCourseAccess(courseId: string, userId: string) {
  try {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    return enrollment?.status === "APPROVED";
  } catch (error) {
    console.error("Error checking course access:", error);
    return false;
  }
}
