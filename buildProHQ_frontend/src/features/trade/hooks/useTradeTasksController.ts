"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MESSAGES } from "@/constants/messages";
import { UI_DEFAULTS } from "@/constants/ui";
import { mapOpenToTradePortal } from "@/features/trade/tradeTaskMappers";
import { tasksApi, type TaskStats } from "@/services/tasksApi.service";
import type { TradePortalTask } from "@/types/domain";
import { appToast } from "@/utils/toast";
import { emitTasksChanged } from "@/utils/taskEvents";

export function useTradeTasksController() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<TradePortalTask[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [taskStats, setTaskStats] = useState<TaskStats | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingTask, setPendingTask] = useState<TradePortalTask | null>(null);

  const pageSize = UI_DEFAULTS.TASK_PAGE_SIZE;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [openRes, stats] = await Promise.all([
        tasksApi.listOpen({
          page,
          limit: pageSize,
          search: search.trim() || undefined,
          sortBy: "daysOpen",
          sortOrder: "desc",
        }),
        tasksApi.getStats(),
      ]);
      setRows(openRes.items.map(mapOpenToTradePortal));
      setTotal(openRes.meta.total);
      setTaskStats(stats);
    } catch {
      appToast.error(MESSAGES.task.loadFailed);
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    void load();
  }, [load]);

  const stats = useMemo(
    () => ({
      assigned: taskStats?.totalOpen ?? 0,
      overdue: taskStats?.overdue10 ?? 0,
      completed: taskStats?.totalCompleted ?? 0,
    }),
    [taskStats],
  );

  const askComplete = (task: TradePortalTask) => {
    setPendingTask(task);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setPendingTask(null);
  };

  const confirmComplete = async () => {
    if (!pendingTask) return;
    try {
      await tasksApi.completeTask(pendingTask.id);
      appToast.success(MESSAGES.task.completed);
      emitTasksChanged();
      closeConfirm();
      await load();
    } catch {
      appToast.error(MESSAGES.common.somethingWrong);
    }
  };

  return {
    loading,
    search,
    setSearch: (value: string) => {
      setSearch(value);
      setPage(1);
    },
    page,
    setPage,
    pageSize,
    total,
    rows,
    stats,
    confirmOpen,
    pendingTask,
    askComplete,
    closeConfirm,
    confirmComplete,
  };
}
