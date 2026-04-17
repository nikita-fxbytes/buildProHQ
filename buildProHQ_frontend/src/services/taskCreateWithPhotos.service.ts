import { MESSAGES } from "@/constants/messages";
import { validateBeforePhotos } from "@/schemas/field-add-task.schema";
import { tasksApi, type TaskFilterValuePayload } from "@/services/tasksApi.service";
import { uploadsApi } from "@/services/uploadsApi.service";
import { sanitizeRichHtml } from "@/utils/richText";

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

export type CreateTaskWithPhotosValues = {
  title: string;
  projectId: string;
  statusId: string;
  priorityId: string;
  description: string;
  dueAt?: string | null;
  assignedToUserIds?: string[];
  taskFilterValues?: TaskFilterValuePayload[];
};

/**
 * Uploads local image files and links them as "before" attachments on an existing task (create or edit flows).
 */
export async function uploadBeforePhotosForTask(taskId: string, files: File[]): Promise<void> {
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
}

export async function createTaskWithOptionalPhotos(
  values: CreateTaskWithPhotosValues,
  files: File[],
): Promise<{ id: string }> {
  const photoErr = validateBeforePhotos(files, MAX_PHOTO_BYTES);
  if (photoErr) {
    throw new Error(photoErr);
  }

  const created = await tasksApi.createTask({
    title: values.title.trim(),
    projectId: values.projectId,
    statusId: values.statusId,
    priorityId: values.priorityId,
    description: sanitizeRichHtml(values.description),
    dueAt: values.dueAt?.trim() ? values.dueAt.trim() : null,
    assignedToUserIds: values.assignedToUserIds ?? [],
    taskFilterValues: values.taskFilterValues ?? [],
  });

  const taskId = created.id;
  if (!taskId) {
    throw new Error(MESSAGES.common.somethingWrong);
  }

  await uploadBeforePhotosForTask(taskId, files);

  return { id: taskId };
}

