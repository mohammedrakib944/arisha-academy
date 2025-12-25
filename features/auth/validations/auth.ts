import { z } from "zod";

export const authSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username is too long"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long"),
});

export type AuthFormData = z.infer<typeof authSchema>;

