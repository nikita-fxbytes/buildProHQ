import type { TaskFilterResolved, TaskListItem } from "@/services/tasksApi.service";

export function getTaskFilterSummary(row: Pick<TaskListItem, "filter_summary">): string {
  return String(row.filter_summary ?? "").trim() || "—";
}

export function formatResolvedTaskFilters(filters?: TaskFilterResolved[] | null): string[] {
  return (Array.isArray(filters) ? filters : [])
    .map((filter) => {
      const name = String(filter.name ?? "").trim() || "Filter";
      const value = String(filter.value ?? "").trim() || "—";
      return `${name}: ${value}`;
    })
    .filter(Boolean);
}
