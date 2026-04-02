import { z } from "zod";
import { emailString, nonEmptyString } from "@/schemas/base.schema";

export const userSchema = z.object({
  name: nonEmptyString.min(2, "Full name is required"),
  email: emailString,
  role: z.enum(["User", "Trade", "Management"]),
  password: z.string().max(64, "Password is too long").optional(),
});

export type UserFormValues = z.infer<typeof userSchema>;
