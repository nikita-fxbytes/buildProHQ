const STORAGE_KEY = "buildprohq.tasks.listFilters.v1";

export type TaskListFiltersSnapshot = {
  search: string;
  projectFilters: string[];
  tradeFilters: string[];
  levelFilters: string[];
  userFilters: string[];
  statusFilters: string[];
  priorityFilters: string[];
};

export type TaskListFilterKey = keyof TaskListFiltersSnapshot;

export function loadTaskListFilters(): Partial<TaskListFiltersSnapshot> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<TaskListFiltersSnapshot>;
  } catch {
    return null;
  }
}

export function saveTaskListFilters(snapshot: TaskListFiltersSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    /* ignore quota */
  }
}
