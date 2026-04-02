import { z } from "zod";
import { nonEmptyString } from "@/schemas/base.schema";

export const managerAddTaskSchema = z.object({
  desc: nonEmptyString.min(3, "Description is required"),
  level: nonEmptyString,
  trade: nonEmptyString,
});

export type ManagerAddTaskFormValues = z.infer<typeof managerAddTaskSchema>;

