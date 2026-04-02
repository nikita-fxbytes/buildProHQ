import { db } from "@/services/mockDb";
import type { CompletedTask, Task } from "@/types/domain";

const wait = async () => new Promise((resolve) => setTimeout(resolve, 80));

export const taskService = {
  async getTasks(): Promise<Task[]> {
    await wait();
    return [...db.tasks];
  },
  async getCompletedTasks(): Promise<CompletedTask[]> {
    await wait();
    return [...db.completedTasks];
  },
  async getManagerCompletedTasks(): Promise<CompletedTask[]> {
    await wait();
    return [...db.completedTasks];
  },
  async createTask(task: Omit<Task, "id" | "days">): Promise<Task> {
    await wait();
    const created: Task = {
      ...task,
      id: db.nextTaskId++,
      days: 0,
    };
    db.tasks.unshift(created);
    return created;
  },
  async completeTasks(taskIds: number[], userInitials?: string): Promise<void> {
    await wait();
    const now = new Date();
    const date = `${now.getDate()}.${now.getMonth() + 1}.${String(now.getFullYear()).slice(-2)}`;
    const completed = db.tasks.filter((task) => taskIds.includes(task.id));
    completed.forEach((task) => {
      db.completedTasks.unshift({
        ...task,
        user: userInitials ?? task.user,
        date,
        duration: task.days,
      });
    });
    db.tasks = db.tasks.filter((task) => !taskIds.includes(task.id));
  },
  async deleteTasks(taskIds: number[]): Promise<void> {
    await wait();
    db.tasks = db.tasks.filter((task) => !taskIds.includes(task.id));
  },
};
