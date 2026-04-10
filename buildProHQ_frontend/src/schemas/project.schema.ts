import { z } from "zod";
import { nonEmptyString } from "@/schemas/base.schema";

export const createProjectSchema = z.object({
  name: nonEmptyString.max(150, "Project name must be at most 150 characters."),
  code: z
    .string()
    .trim()
    .max(50, "Project code must be at most 50 characters.")
    .optional()
    .or(z.literal("")),
});

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;

