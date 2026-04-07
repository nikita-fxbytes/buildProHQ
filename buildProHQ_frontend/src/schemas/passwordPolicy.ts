import { z } from "zod";

export const PASSWORD_POLICY_HELPER =
  "Min 8 characters with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character. No spaces.";

const PASSWORD_POLICY_MESSAGE =
  "Password must be min 8 with 1 uppercase, 1 lowercase, 1 number, 1 special character, and no spaces.";

export const passwordPolicySchema = z
  .string()
  .min(8, PASSWORD_POLICY_MESSAGE)
  .refine((v) => !/\s/.test(v), PASSWORD_POLICY_MESSAGE)
  .refine((v) => /[a-z]/.test(v), PASSWORD_POLICY_MESSAGE)
  .refine((v) => /[A-Z]/.test(v), PASSWORD_POLICY_MESSAGE)
  .refine((v) => /\d/.test(v), PASSWORD_POLICY_MESSAGE)
  .refine((v) => /[^A-Za-z0-9]/.test(v), PASSWORD_POLICY_MESSAGE);

