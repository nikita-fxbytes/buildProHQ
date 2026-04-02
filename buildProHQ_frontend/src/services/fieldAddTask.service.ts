import { taskService } from "@/services/task.service";
import { sessionService } from "@/services/session.service";
import type { Task } from "@/types/domain";

export type FieldAddTaskOptions = {
  levels: string[];
  trades: string[];
};

export const fieldAddTaskService = {
  async getOptions(): Promise<FieldAddTaskOptions> {
    const tasks = await taskService.getTasks();
    const levels = [...new Set(tasks.map((task) => task.level))].sort();
    const trades = [...new Set(tasks.map((task) => task.trade))].sort();
    return { levels, trades };
  },
  async createTask(input: Pick<Task, "desc" | "level" | "trade">): Promise<void> {
    const session = sessionService.getUser();
    await taskService.createTask({
      ...input,
      user: session?.initials ?? "RG",
    });
  },
};
