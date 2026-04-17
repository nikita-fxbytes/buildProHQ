import type { TaskListItem } from "@/services/tasksApi.service";
import type { TradePortalCompletedTask, TradePortalTask } from "@/types/domain";
import { getTaskFilterSummary } from "@/utils/taskFilters";

export function mapOpenToTradePortal(row: TaskListItem): TradePortalTask {
  return {
    id: row.id,
    filters: getTaskFilterSummary(row),
    desc: row.description,
    days: row.days_open,
  };
}

export function mapCompletedToTradePortal(row: TaskListItem): TradePortalCompletedTask {
  return {
    id: row.id,
    filters: getTaskFilterSummary(row),
    desc: row.description,
    date: row.closed_at ?? row.created_at,
    duration: row.days_open,
  };
}
