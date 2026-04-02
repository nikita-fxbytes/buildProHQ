import { z } from "zod";

export const addTaskSchema = z.object({
  desc: z.string(),
  level: z.string(),
  trade: z.string(),
});

export type AddTaskValues = z.infer<typeof addTaskSchema>;
