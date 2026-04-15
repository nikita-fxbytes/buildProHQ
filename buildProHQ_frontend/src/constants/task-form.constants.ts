/** Matches HTML mockup priority selector (`buildprohq_v5.html` — Add Action Item). */
export const TASK_PRIORITY_CODES = ["low", "medium", "high", "critical"] as const;

export type TaskPriorityCode = (typeof TASK_PRIORITY_CODES)[number];

/** UI label per priority code (HTML design). */
export const TASK_PRIORITY_LABEL: Record<TaskPriorityCode, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "⚠ CRITICAL / SAFETY",
};

/** Select / compact labels (create & edit forms): critical is shown as "Urgent". */
export const TASK_PRIORITY_SELECT_LABEL: Record<TaskPriorityCode, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Urgent",
};

/** MUI-oriented styles aligned with mockup `.priority-*` classes. */
export const TASK_PRIORITY_SX: Record<
  TaskPriorityCode,
  { border: string; background: string; color: string }
> = {
  low: {
    border: "2px solid #BAE6FD",
    background: "#F0F9FF",
    color: "#0369A1",
  },
  medium: {
    border: "2px solid #FED7AA",
    background: "#FFF7ED",
    color: "#C2410C",
  },
  high: {
    border: "2px solid #FECACA",
    background: "#FEF2F2",
    color: "#B91C1C",
  },
  critical: {
    border: "2px solid #7F1D1D",
    background: "#450A0A",
    color: "#FCA5A5",
  },
};

/** Max before-photos per HTML (reasonable cap; server enforces size). */
export const TASK_BEFORE_PHOTOS_MAX = 12;
