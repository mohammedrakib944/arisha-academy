import { z } from "zod";

// Maximum file size: 3MB (3 * 1024 * 1024 bytes)
const MAX_FILE_SIZE = 3 * 1024 * 1024;

// Custom FileList validator that works in both browser and server environments
const fileListSchema = z
  .custom<FileList | undefined>((val) => {
    if (val === undefined || val === null) return true;
    // Check if it's a FileList-like object (has length and item method)
    return (
      typeof val === "object" &&
      "length" in val &&
      typeof (val as any).length === "number" &&
      typeof (val as any).item === "function"
    );
  }, "Must be a FileList")
  .refine(
    (val) => {
      if (!val || val.length === 0) return true;
      const file = val[0];
      return !file || file.size <= MAX_FILE_SIZE;
    },
    {
      message: "File size must be less than 3MB",
    }
  );

export const lessonSchema = z.object({
  title: z.string().min(1, "Lesson title is required"),
  description: z.string().optional(),
});

export const subjectSchema = z
  .object({
    name: z.string().min(1, "Subject name is required"),
    lessons: z.array(lessonSchema).default([]),
  })
  .transform((data) => ({
    name: data.name,
    lessons: data.lessons || [],
  }));

export const courseInputSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().default(""),
  price: z.number().min(0, "Price must be positive"),
  totalClasses: z.number().int().min(0).default(0),
  totalExams: z.number().int().min(0).default(0),
  overview: z.string().default(""),
  courseOutlineUrl: z.string().default(""),
  teacherIds: z.array(z.string()).default([]),
  subjects: z.array(subjectSchema).default([]),
  thumbnail: fileListSchema.optional(),
  routineImage: fileListSchema.optional(),
});

export const courseSchema = courseInputSchema.transform((data) => ({
  ...data,
  thumbnail:
    data.thumbnail && data.thumbnail.length > 0 ? data.thumbnail[0] : undefined,
  routineImage:
    data.routineImage && data.routineImage.length > 0
      ? data.routineImage[0]
      : undefined,
}));

// Server-side schema that accepts File objects (after transformation)
// File objects can be serialized when sent over network, so we check for File-like objects
const fileSchema = z
  .custom<File | undefined>((val) => {
    if (val === undefined || val === null) return true;
    // Check if it's a File object or File-like object (has size property)
    return (
      val instanceof File ||
      (typeof val === "object" &&
        "size" in val &&
        typeof (val as any).size === "number")
    );
  }, "Must be a File object")
  .refine(
    (file) => {
      if (!file) return true;
      const size = file instanceof File ? file.size : (file as any).size;
      return size <= MAX_FILE_SIZE;
    },
    {
      message: "File size must be less than 3MB",
    }
  )
  .optional();

export const courseFormDataSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().default(""),
  price: z.number().min(0, "Price must be positive"),
  totalClasses: z.number().int().min(0).default(0),
  totalExams: z.number().int().min(0).default(0),
  overview: z.string().default(""),
  courseOutlineUrl: z.string().default(""),
  teacherIds: z.array(z.string()).default([]),
  subjects: z.array(subjectSchema).default([]),
  thumbnail: fileSchema,
  routineImage: fileSchema,
});

export type CourseFormData = z.infer<typeof courseSchema>;
export type CourseFormInput = z.input<typeof courseInputSchema>;
