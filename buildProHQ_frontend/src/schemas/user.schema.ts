import { z } from "zod";
import { emailString, nonEmptyString } from "@/schemas/base.schema";

export const userSchema = z.object({
  name: nonEmptyString.min(2, "Full name is required"),
  email: emailString,
  role: z.enum(["User", "Trade", "Management"]),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password is too long")
    .optional()
    .or(z.literal("")),
});

export type UserFormValues = z.infer<typeof userSchema>;
