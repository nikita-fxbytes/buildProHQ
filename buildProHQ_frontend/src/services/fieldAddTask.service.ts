import { MESSAGES } from "@/constants/messages";
import type { FieldAddTaskFormValues } from "@/schemas/field-add-task.schema";
import { loadAddTaskLookups, type AddTaskLookups } from "@/services/addTaskLookups.service";
import { createTaskWithOptionalPhotos } from "@/services/taskCreateWithPhotos.service";

export type FieldAddTaskLookups = {
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
      title: values.title.trim(),
      projectId: values.projectId,
      statusId: openStatusId,
      priorityId: values.priorityId,
      description: values.description,
      taskFilterValues: values.taskFilterValues ?? [],
      },
      files,
    );
  },
};
