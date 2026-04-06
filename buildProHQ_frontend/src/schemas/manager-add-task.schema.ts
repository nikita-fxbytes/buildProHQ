import { z } from "zod";
import { MESSAGES } from "@/constants/messages";
import { htmlToPlainText } from "@/utils/richText";

export const managerAddTaskSchema = z.object({
  description: z.string().superRefine((val, ctx) => {
    const plain = htmlToPlainText(val);
    if (!plain) {
      ctx.addIssue({ code: "custom", message: MESSAGES.validation.taskDescriptionRequired });
    } else if (plain.length < 3) {
      ctx.addIssue({ code: "custom", message: MESSAGES.validation.taskDescriptionMin });
    }
  }),
  levelId: z
    .string()
    .min(1, MESSAGES.validation.selectLevel)
    .uuid(MESSAGES.validation.selectLevel),
  tradeId: z
    .string()
    .min(1, MESSAGES.validation.selectTrade)
    .uuid(MESSAGES.validation.selectTrade),
  priorityId: z
    .string()
    .min(1, MESSAGES.validation.selectPriority)
    .uuid(MESSAGES.validation.selectPriority),
});

export type ManagerAddTaskFormValues = z.infer<typeof managerAddTaskSchema>;

