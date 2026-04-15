import { MESSAGES } from "@/constants/messages";

export type ProjectOptionRow = { value: string; label: string };

/**
 * Ensures the currently selected project appears in the dropdown list (e.g. after search clears).
 */
export function mergeProjectOptionRow(
  rows: ProjectOptionRow[],
  projectId: string | null | undefined,
  projectLabel: string | null | undefined,
): ProjectOptionRow[] {
  if (!projectId) return rows;
  if (rows.some((r) => r.value === projectId)) return rows;
  const label = projectLabel?.trim() || MESSAGES.task.projectUnknownName;
  return [{ value: projectId, label }, ...rows];
}
