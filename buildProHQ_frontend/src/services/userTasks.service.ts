import { taskService } from "@/services/task.service";
import type { CompletedTask, Task } from "@/types/domain";

export const userTasksService = {
  async getOpenTasks(): Promise<Task[]> {
    return taskService.getTasks();
  },
  async getCompletedTasks(): Promise<CompletedTask[]> {
    return taskService.getCompletedTasks();
  },
  async completeTasks(ids: number[], userInitials?: string): Promise<void> {
    await taskService.completeTasks(ids, userInitials);
  },
  async deleteTasks(ids: number[]): Promise<void> {
    await taskService.deleteTasks(ids);
  },
};

