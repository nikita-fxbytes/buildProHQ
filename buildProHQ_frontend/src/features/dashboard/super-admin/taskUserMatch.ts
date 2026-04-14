import type { TaskListItem } from "@/services/tasksApi.service";

export type SuperDashboardRoleTab = "Management" | "Trade" | "User";

/**
 * Approximate which open tasks belong to a user for the Super Admin snapshot.
 *
 * TODO(backend): add `assignedToUserIds` (and/or membership-based scoping) on POST /v1/tasks/open
 * so we do not fetch global lists and filter client-side (does not scale; misses tasks beyond the page limit).
 */
export function taskBelongsToUserForSnapshot(
  task: TaskListItem,
  tab: SuperDashboardRoleTab,
  userId: string,
): boolean {
  if (tab === "Trade") {
    return task.assigned_to_user_id === userId;
  }
  if (tab === "Management") {
    return task.created_by_user_id === userId;
  }
  return task.created_by_user_id === userId || task.assigned_to_user_id === userId;
}
