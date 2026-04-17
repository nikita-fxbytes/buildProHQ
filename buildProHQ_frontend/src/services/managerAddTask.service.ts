import { loadAddTaskLookups, type AddTaskLookups } from "@/services/addTaskLookups.service";
import { createTaskWithOptionalPhotos } from "@/services/taskCreateWithPhotos.service";

export type ManagerAddTaskLookups = {
  priorities: AddTaskLookups["priorities"];
  openStatusId: AddTaskLookups["openStatusId"];
  defaultPriorityId: AddTaskLookups["defaultPriorityId"];
};

export const managerAddTaskService = {
  async loadLookups(): Promise<ManagerAddTaskLookups> {
    return loadAddTaskLookups();
  },
  async createTaskWithOptionalPhotos(values: {
    title: string;
    projectId: string;
    statusId: string;
    priorityId: string;
    description: string;
    dueAt?: string | null;
    assignedToUserIds?: string[];
    taskFilterValues?: import("@/services/tasksApi.service").TaskFilterValuePayload[];
  }, files: File[]): Promise<{ id: string }> {
    return createTaskWithOptionalPhotos(values, files);
  },
};

