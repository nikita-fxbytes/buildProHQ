/**
 * Calendar days from today to the due date (local midnight).
 * Negative = overdue, 0 = due today, positive = upcoming.
 */
import { formatDate } from "@/utils/date";

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
  // Use global formatter for consistent app-wide display.
  if (!iso) return "";
  const out = formatDate(iso);
  return out === "-" ? "" : out;
}
