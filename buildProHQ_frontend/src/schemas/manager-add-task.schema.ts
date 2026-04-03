import { z } from "zod";
import { MESSAGES } from "@/constants/messages";
import { htmlToPlainText } from "@/utils/richText";

export const managerAddTaskSchema = z.object({
  desc: z.string().superRefine((val, ctx) => {
    const plain = htmlToPlainText(val);
    if (!plain) {
      ctx.addIssue({ code: "custom", message: MESSAGES.validation.taskDescriptionRequired });
    } else if (plain.length < 3) {
      ctx.addIssue({ code: "custom", message: MESSAGES.validation.taskDescriptionMin });
    }
  }),
  level: z.string().trim().min(1, MESSAGES.validation.selectLevel),
  trade: z.string().trim().min(1, MESSAGES.validation.selectTrade),
});

export type ManagerAddTaskFormValues = z.infer<typeof managerAddTaskSchema>;

