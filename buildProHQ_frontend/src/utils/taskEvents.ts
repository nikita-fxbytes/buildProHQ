/**
 * Browser event used to refetch sidebar badges / task stats after mutations.
 * Keep name stable; `PortalSidebar` listens for this.
 */
export const TASKS_CHANGED_EVENT = "buildprohq:tasksChanged";

export function emitTasksChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(TASKS_CHANGED_EVENT));
}
