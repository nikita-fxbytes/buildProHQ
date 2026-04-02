import { taskService } from "@/services/task.service";
import type { Task } from "@/types/domain";

export const tradeTasksService = {
  async getAssignedTasks(trade: string): Promise<Task[]> {
    const tasks = await taskService.getTasks();
    return tasks.filter((task) => task.trade === trade);
  },
  async completeAssignedTask(taskId: number, userInitials: string): Promise<void> {
    await taskService.completeTasks([taskId], userInitials);
  },
};

