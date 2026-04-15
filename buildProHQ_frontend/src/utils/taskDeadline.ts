/**
 * Calendar days from today to the due date (local midnight).
 * Negative = overdue, 0 = due today, positive = upcoming.
 */
export function computeDaysToDeadline(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const raw = new Date(iso);
  if (Number.isNaN(raw.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(raw);
  due.setHours(0, 0, 0, 0);
  return Math.round((due.getTime() - today.getTime()) / 86_400_000);
}

export function formatDeadlineDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}
