import { z } from "zod";

export const transactionSchema = z.object({
  transactionId: z.string().min(1, "Transaction ID is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long"),
  courseId: z.string().optional(),
  bookId: z.string().optional(),
}).refine(
  (data) => data.courseId || data.bookId,
  {
    message: "Either course or book must be selected",
    path: ["courseId"],
  }
);

export type TransactionFormData = z.infer<typeof transactionSchema>;

