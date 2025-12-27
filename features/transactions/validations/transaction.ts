import { z } from "zod";
import {
  validatePhoneNumber,
  normalizePhoneNumber,
} from "@/lib/phone-validation";

// Custom phone number validation
const phoneNumberSchema = z
  .string()
  .min(1, "Phone number is required")
  .superRefine((phone: string, ctx) => {
    const validation = validatePhoneNumber(phone);
    if (!validation.isValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: validation.error || "Invalid phone number format",
      });
    }
  })
  .transform((phone: string) => normalizePhoneNumber(phone));

export const transactionSchema = z
  .object({
    transactionId: z.string().min(1, "Transaction ID is required").trim(),
    phoneNumber: phoneNumberSchema,
    courseId: z.string().optional(),
    bookId: z.string().optional(),
  })
  .refine((data) => data.courseId || data.bookId, {
    message: "Either course or book must be selected",
    path: ["courseId"],
  });

export type TransactionFormData = z.infer<typeof transactionSchema>;
