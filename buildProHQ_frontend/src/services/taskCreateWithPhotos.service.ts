import { MESSAGES } from "@/constants/messages";
import { validateBeforePhotos } from "@/schemas/field-add-task.schema";
import { tasksApi } from "@/services/tasksApi.service";
import { uploadsApi } from "@/services/uploadsApi.service";
import { sanitizeRichHtml } from "@/utils/richText";

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

export type CreateTaskWithPhotosValues = {
  projectId: string;
  statusId: string;
  levelId: string;
  tradeId: string;
  priorityId: string;
  description: string;
};

export async function createTaskWithOptionalPhotos(
  values: CreateTaskWithPhotosValues,
  files: File[],
): Promise<{ id: string }> {
  const photoErr = validateBeforePhotos(files, MAX_PHOTO_BYTES);
  if (photoErr) {
    throw new Error(photoErr);
  }

  const created = await tasksApi.createTask({
    projectId: values.projectId,
    statusId: values.statusId,
    levelId: values.levelId,
    tradeId: values.tradeId,
    priorityId: values.priorityId,
    description: sanitizeRichHtml(values.description),
  });

  const taskId = created.id;
  if (!taskId) {
    throw new Error(MESSAGES.common.somethingWrong);
  }

  for (const file of files) {
    const uploaded = await uploadsApi.uploadImage(file);
    await tasksApi.addAttachment(taskId, {
      fileUrl: uploaded.fileUrl,
      fileName: uploaded.fileName,
      fileType: uploaded.fileType,
      mimeType: uploaded.mimeType,
      fileSize: uploaded.fileSize,
      isBefore: true,
      isAfter: false,
    });
  }

  return { id: taskId };
}

