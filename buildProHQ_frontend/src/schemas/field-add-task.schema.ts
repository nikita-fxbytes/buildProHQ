import { z } from "zod";
import { MESSAGES } from "@/constants/messages";
import { TASK_BEFORE_PHOTOS_MAX } from "@/constants/task-form.constants";
import { htmlToPlainText } from "@/utils/richText";

export const fieldAddTaskSchema = z.object({
  projectId: z
    .string()
    .min(1, MESSAGES.validation.selectProject)
    .uuid(MESSAGES.validation.selectProject),
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

export type FieldAddTaskFormValues = z.infer<typeof fieldAddTaskSchema>;

/** Client-side validation for optional before-photos (matches HTML upload rules). */
export function validateBeforePhotos(files: File[], maxBytes: number): string | null {
  if (files.length > TASK_BEFORE_PHOTOS_MAX) {
    return MESSAGES.validation.photosTooMany;
  }
  for (const f of files) {
    const typeOk = /^image\/(jpeg|png|webp|heic|heif)$/i.test(f.type);
    const extOk = /\.(jpe?g|png|webp|heic|heif)$/i.test(f.name);
    if (!typeOk && !extOk) {
      return MESSAGES.validation.photoInvalidType;
    }
    if (f.size > maxBytes) {
      return MESSAGES.validation.photoTooLarge;
    }
  }
  return null;
}
