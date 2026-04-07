import type { CompletedTaskListItem, TaskListItem } from "@/services/tasksApi.service";
import type { TradePortalCompletedTask, TradePortalTask } from "@/types/domain";

export function mapOpenToTradePortal(row: TaskListItem): TradePortalTask {
  return {
    id: row.id,
    level: row.level_name ?? "–",
    trade: row.trade_name ?? "–",
    desc: row.description,
    days: row.days_open,
  };
}

export function mapCompletedToTradePortal(row: CompletedTaskListItem): TradePortalCompletedTask {
  return {
    id: row.id,
    level: row.level_name ?? "–",
    trade: row.trade_name ?? "–",
    desc: row.description,
    date: row.closed_at,
    duration: row.days_open,
  };
}
