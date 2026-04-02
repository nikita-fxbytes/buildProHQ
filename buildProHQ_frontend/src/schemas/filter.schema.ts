import { z } from "zod";

export const addFilterSchema = z.object({
  name: z.string(),
  subs: z.string().optional(),
});

export const quickAddSchema = z.object({
  value: z.string(),
});

export type AddFilterValues = z.infer<typeof addFilterSchema>;
export type QuickAddValues = z.infer<typeof quickAddSchema>;
