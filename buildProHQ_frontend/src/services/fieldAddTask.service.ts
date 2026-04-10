import { MESSAGES } from "@/constants/messages";
import type { FieldAddTaskFormValues } from "@/schemas/field-add-task.schema";
import { loadAddTaskLookups, type AddTaskLookups } from "@/services/addTaskLookups.service";
import { createTaskWithOptionalPhotos } from "@/services/taskCreateWithPhotos.service";

export type FieldAddTaskLookups = {
  levels: AddTaskLookups["levels"];
  trades: AddTaskLookups["trades"];
  priorities: AddTaskLookups["priorities"];
  openStatusId: AddTaskLookups["openStatusId"];
  defaultPriorityId: AddTaskLookups["defaultPriorityId"];
};

export const fieldAddTaskService = {
  async loadLookups(): Promise<FieldAddTaskLookups> {
    return loadAddTaskLookups();
  },

  async createTaskWithOptionalPhotos(
    values: FieldAddTaskFormValues,
    openStatusId: string,
    files: File[],
  ): Promise<void> {
    await createTaskWithOptionalPhotos(
      {
      projectId: values.projectId,
      statusId: openStatusId,
      levelId: values.levelId,
      tradeId: values.tradeId,
      priorityId: values.priorityId,
      description: values.description,
      },
      files,
    );
  },
};
