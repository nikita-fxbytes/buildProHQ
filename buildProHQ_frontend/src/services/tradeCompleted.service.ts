import { taskService } from "@/services/task.service";
import type { CompletedTask } from "@/types/domain";

export const tradeCompletedService = {
  async getCompletedTasks(trade: string): Promise<CompletedTask[]> {
    const items = await taskService.getCompletedTasks();
    return items.filter((item) => item.trade === trade);
  },
};

