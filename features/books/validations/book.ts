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

export const bookInputSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be positive"),
  thumbnail: fileListSchema.optional(),
});

export const bookSchema = bookInputSchema.transform((data) => ({
  ...data,
  thumbnail:
    data.thumbnail && data.thumbnail.length > 0 ? data.thumbnail[0] : undefined,
}));

export type BookFormData = z.infer<typeof bookSchema>;
export type BookFormInput = z.input<typeof bookInputSchema>;

