export const TASK_PRIORITY_CODES = {
  low: 'low',
  medium: 'medium',
  high: 'high',
  critical: 'critical',
} as const;

export const ALLOWED_TASK_PRIORITY_CODES = new Set<string>(
  Object.values(TASK_PRIORITY_CODES),
);
