"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MESSAGES } from "@/constants/messages";
import { UI_DEFAULTS } from "@/constants/ui";
import { useAuth } from "@/contexts/AuthContext";
import { tradeCompletedService } from "@/services/tradeCompleted.service";
import { tradeTasksService } from "@/services/tradeTasks.service";
import type { Task } from "@/types/domain";
import { appToast } from "@/utils/toast";

const DEFAULT_TRADE = "Painter";
const DEFAULT_INITIALS = "SP";

export function useTradeTasksController() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [allRows, setAllRows] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingTask, setPendingTask] = useState<Task | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const activeTrade = user?.trade ?? DEFAULT_TRADE;
  const activeInitials = user?.initials ?? DEFAULT_INITIALS;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [assigned, completed] = await Promise.all([
        tradeTasksService.getAssignedTasks(activeTrade),
        tradeCompletedService.getCompletedTasks(activeTrade),
      ]);
      setAllRows(assigned);
      setCompletedCount(completed.length);
    } catch {
      appToast.error(MESSAGES.task.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [activeTrade]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return allRows;
    return allRows.filter(
      (task) =>
        task.level.toLowerCase().includes(term) ||
        task.trade.toLowerCase().includes(term) ||
        task.desc.toLowerCase().includes(term),
    );
  }, [allRows, search]);

  const pageSize = UI_DEFAULTS.TASK_PAGE_SIZE;
  const total = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const rows = useMemo(
    () => filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filteredRows, safePage, pageSize],
  );

  const stats = useMemo(
    () => ({
      assigned: allRows.length,
      overdue: allRows.filter((task) => task.days > 10).length,
      completed: completedCount,
    }),
    [allRows, completedCount],
  );

  const askComplete = (task: Task) => {
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
      await tradeTasksService.completeAssignedTask(pendingTask.id, activeInitials);
      appToast.success(MESSAGES.task.completed);
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
    page: safePage,
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

