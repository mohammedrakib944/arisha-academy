import { z } from "zod";

// Custom FileList validator that works in both browser and server environments
const fileListSchema = z.custom<FileList | undefined>((val) => {
  if (val === undefined || val === null) return true;
  // Check if it's a FileList-like object (has length and item method)
  return (
    typeof val === "object" &&
    "length" in val &&
    typeof (val as any).length === "number" &&
    typeof (val as any).item === "function"
  );
}, "Must be a FileList");

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

export type CourseFormData = z.infer<typeof courseSchema>;
export type CourseFormInput = z.input<typeof courseInputSchema>;

