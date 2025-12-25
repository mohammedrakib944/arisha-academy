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

export const teacherInputSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  bio: z.string().optional(),
  subjects: z.array(z.string()).default([]),
  image: fileListSchema.optional(),
});

export const teacherSchema = teacherInputSchema.transform((data) => ({
  ...data,
  image: data.image && data.image.length > 0 ? data.image[0] : undefined,
}));

export type TeacherFormData = z.infer<typeof teacherSchema>;
export type TeacherFormInput = z.input<typeof teacherInputSchema>;

