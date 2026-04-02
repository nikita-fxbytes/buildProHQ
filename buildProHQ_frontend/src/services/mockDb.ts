import type { CompletedTask, FilterCategory, Task, User } from "@/types/domain";
import { mockCompletedTasks, mockFilters, mockTasks, mockUsers } from "@/data/mock-data";

/** Mock persistence shell — wire real API/mock data in implementation phase. */
export const db: {
  tasks: Task[];
  completedTasks: CompletedTask[];
  users: User[];
  filters: FilterCategory[];
  nextTaskId: number;
  nextUserId: number;
} = {
  tasks: [...mockTasks],
  completedTasks: [...mockCompletedTasks],
  users: [...mockUsers],
  filters: [...mockFilters],
  nextTaskId: 100,
  nextUserId: 100,
};
