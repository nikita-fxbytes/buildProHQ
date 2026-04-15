import { TASK_PRIORITY_CODES, TASK_PRIORITY_SELECT_LABEL } from "@/constants/task-form.constants";
import type { LookupItem } from "@/services/lookupsApi.service";

/**
 * Builds select options for the four standard priorities (Low → Urgent),
 * in a stable order, using lookup UUIDs from the API.
 */
export function buildTaskPrioritySelectOptions(priorities: LookupItem[]): { value: string; label: string }[] {
  const byCode = new Map(priorities.map((p) => [p.code.toLowerCase(), p] as const));
  return TASK_PRIORITY_CODES.map((code) => {
    const row = byCode.get(code);
    return row
      ? { value: row.id, label: TASK_PRIORITY_SELECT_LABEL[code] }
      : null;
  }).filter((x): x is { value: string; label: string } => x !== null);
}
