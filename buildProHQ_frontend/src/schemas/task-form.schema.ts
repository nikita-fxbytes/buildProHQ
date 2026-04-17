import { z } from "zod";
import { MESSAGES } from "@/constants/messages";
import { htmlToPlainText } from "@/utils/richText";

const taskFilterValueSchema = z.object({
  filterId: z.string().uuid(),
  subFilterIds: z.array(z.string().uuid()).optional(),
  textValue: z.string().max(4000).optional().nullable(),
});

/**
 * Shared task form values for create + edit (manager/super portals).
 * Single source of truth so new fields appear in both flows automatically.
 */
export const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, MESSAGES.validation.taskTitleRequired)
    .max(500, MESSAGES.validation.taskTitleMaxLength),
  description: z.string().superRefine((val, ctx) => {
    const plain = htmlToPlainText(val);
    if (!plain) {
      ctx.addIssue({ code: "custom", message: MESSAGES.validation.taskDescriptionRequired });
    } else if (plain.length < 3) {
      ctx.addIssue({ code: "custom", message: MESSAGES.validation.taskDescriptionMin });
    }
  }),
  projectId: z.string().min(1, MESSAGES.validation.selectProject).uuid(MESSAGES.validation.selectProject),
  taskFilterValues: z.array(taskFilterValueSchema).optional(),
  priorityId: z.string().min(1, MESSAGES.validation.selectPriority).uuid(MESSAGES.validation.selectPriority),
  dueDate: z.string().optional(),
  assignedToUserIds: z.array(z.string().uuid()).optional(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
