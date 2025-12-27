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

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name is too long")
      .trim(),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name is too long")
      .trim(),
    phoneNumber: phoneNumberSchema,
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  phoneNumber: phoneNumberSchema,
  password: z.string().min(1, "Password is required"),
});

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
