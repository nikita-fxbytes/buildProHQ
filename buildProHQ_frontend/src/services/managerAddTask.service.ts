import { loadAddTaskLookups, type AddTaskLookups } from "@/services/addTaskLookups.service";
import { createTaskWithOptionalPhotos } from "@/services/taskCreateWithPhotos.service";

export type ManagerAddTaskLookups = {
  levels: AddTaskLookups["levels"];
  trades: AddTaskLookups["trades"];
  priorities: AddTaskLookups["priorities"];
  openStatusId: AddTaskLookups["openStatusId"];
  defaultPriorityId: AddTaskLookups["defaultPriorityId"];
};

export const managerAddTaskService = {
  async loadLookups(): Promise<ManagerAddTaskLookups> {
    return loadAddTaskLookups();
  },
  async createTaskWithOptionalPhotos(values: {
    statusId: string;
    levelId: string;
    tradeId: string;
    priorityId: string;
    description: string;
  }, files: File[]): Promise<{ id: string }> {
    return createTaskWithOptionalPhotos(values, files);
  },
};

