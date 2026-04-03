import { taskService } from "@/services/task.service";
import type { Task } from "@/types/domain";
import { sanitizeRichHtml } from "@/utils/richText";

export type ManagerAddTaskOptions = {
  levels: string[];
  trades: string[];
};

export const managerAddTaskService = {
  async getOptions(): Promise<ManagerAddTaskOptions> {
    const tasks = await taskService.getTasks();
    const levels = [...new Set(tasks.map((task) => task.level))].sort();
    const trades = [...new Set(tasks.map((task) => task.trade))].sort();
    return { levels, trades };
  },
  async createTask(input: Pick<Task, "desc" | "level" | "trade">): Promise<void> {
    await taskService.createTask({
      ...input,
      desc: sanitizeRichHtml(input.desc),
      user: "MGR",
    });
  },
};

