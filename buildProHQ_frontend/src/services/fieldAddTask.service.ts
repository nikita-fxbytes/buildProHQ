import { MESSAGES } from "@/constants/messages";
import type { FieldAddTaskFormValues } from "@/schemas/field-add-task.schema";
import { validateBeforePhotos } from "@/schemas/field-add-task.schema";
import { lookupsApi } from "@/services/lookupsApi.service";
import { tasksApi } from "@/services/tasksApi.service";
import { uploadsApi } from "@/services/uploadsApi.service";
import { sanitizeRichHtml } from "@/utils/richText";

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

export type FieldAddTaskLookups = {
  levels: Awaited<ReturnType<typeof lookupsApi.getLevels>>;
  trades: Awaited<ReturnType<typeof lookupsApi.getTrades>>;
  priorities: Awaited<ReturnType<typeof lookupsApi.getTaskPriorities>>;
  openStatusId: string;
  defaultPriorityId: string;
};

export const fieldAddTaskService = {
  async loadLookups(): Promise<FieldAddTaskLookups> {
    const [levels, trades, priorities, statuses] = await Promise.all([
      lookupsApi.getLevels(),
      lookupsApi.getTrades(),
      lookupsApi.getTaskPriorities(),
      lookupsApi.getTaskStatuses(),
    ]);
    const open = statuses.find((s) => s.code === "open");
    const medium = priorities.find((p) => p.code === "medium");
    if (!open) {
      throw new Error(MESSAGES.validation.openStatusMissing);
    }
    if (!medium) {
      throw new Error(MESSAGES.validation.priorityDefaultMissing);
    }
    return {
      levels,
      trades,
      priorities,
      openStatusId: open.id,
      defaultPriorityId: medium.id,
    };
  },

  async createTaskWithOptionalPhotos(
    values: FieldAddTaskFormValues,
    openStatusId: string,
    files: File[],
  ): Promise<void> {
    const photoErr = validateBeforePhotos(files, MAX_PHOTO_BYTES);
    if (photoErr) {
      throw new Error(photoErr);
    }

    const created = await tasksApi.createTask({
      statusId: openStatusId,
      levelId: values.levelId,
      tradeId: values.tradeId,
      description: sanitizeRichHtml(values.description),
      priorityId: values.priorityId,
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
  },
};
