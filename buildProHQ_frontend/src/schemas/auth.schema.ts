import { z } from "zod";
import { MESSAGES } from "@/constants/messages";

const loginEmailSchema = z
  .string()
  .trim()
  .min(1, MESSAGES.validation.emailRequired)
  .email(MESSAGES.validation.emailInvalid)
  .max(255, MESSAGES.validation.emailMaxLength);

const loginPasswordSchema = z
  .string()
  .min(1, MESSAGES.validation.passwordRequired)
  .max(128, MESSAGES.validation.passwordMaxLength)
  .refine((value) => /\S/.test(value), MESSAGES.validation.passwordWhitespaceOnly)
  .min(8, MESSAGES.validation.passwordMinLength);

export const loginSchema = z.object({
  email: loginEmailSchema,
  password: loginPasswordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;
