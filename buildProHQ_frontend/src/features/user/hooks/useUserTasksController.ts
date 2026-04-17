"use client";

import { useCallback, useEffect, useState } from "react";
import { MESSAGES } from "@/constants/messages";
import { UI_DEFAULTS } from "@/constants/ui";
import { useTableSort } from "@/hooks/use-table-sort";
import {
  tasksApi,
  type TaskAttachmentItem,
  type TaskListItem,
  type TaskStats,
  type ListOpenTasksBody,
} from "@/services/tasksApi.service";
import { getTaskFilterSummary } from "@/utils/taskFilters";
import { truncateRichPlainText } from "@/utils/richText";
import { appToast } from "@/utils/toast";
import { emitTasksChanged } from "@/utils/taskEvents";

type ConfirmAction = "completeSelected" | "deleteSelected" | "deleteSingle";

const mapRow = (row: TaskListItem) => ({
  id: row.id,
  filters: getTaskFilterSummary(row),
  priority: row.priority_name ?? "-",
  desc: row.description,
  days: row.days_open ?? 0,
});

type ActionItemRow = ReturnType<typeof mapRow>;

export function useUserTasksController() {
  /** Stats cards only — toggled by `loadStats`, not by table sort/page/search. */
  const [statsLoading, setStatsLoading] = useState(true);
  /** Task grid only — toggled by `loadTasks` (sort, search, filters, pagination, mutations). */
  const [tableLoading, setTableLoading] = useState(true);
  const [rows, setRows] = useState<ActionItemRow[]>([]);
  const [stats, setStats] = useState<TaskStats>({
    totalOpen: 0,
    totalCompleted: 0,
    urgent: 0,
    overdue: 0,
    overdue10: 0,
    midRange7to10: 0,
    fresh0to6: 0,
  });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  type SortKey = "priority" | "description" | "daysOpen" | "createdAt";
  const { sortKey, sortDirection, toggleSort, setSortKey, setSortDirection } =
    useTableSort<SortKey>("createdAt");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmLabel, setConfirmLabel] = useState("Confirm");
  const [confirmColor, setConfirmColor] = useState<"error" | "success" | "primary">("error");
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [singleDeleteId, setSingleDeleteId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTask, setDetailTask] = useState<ActionItemRow | null>(null);
  const [detailAttachments, setDetailAttachments] = useState<TaskAttachmentItem[]>([]);
  const [detailAttachmentsLoading, setDetailAttachmentsLoading] = useState(false);

  const pageSize = UI_DEFAULTS.TASK_PAGE_SIZE;

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await tasksApi.getStats();
      setStats(res);
    } catch {
      // Non-fatal; keep the page usable even if stats fail.
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadTasks = useCallback(
    async (opts?: { pageOverride?: number; searchOverride?: string }) => {
      setTableLoading(true);
      try {
        const queryPage = opts?.pageOverride ?? page;
        const querySearch = (opts?.searchOverride ?? search).trim() || undefined;
        const query: ListOpenTasksBody = {
          page: queryPage,
          limit: pageSize,
          search: querySearch,
          sortBy: sortKey ?? undefined,
          sortOrder: sortDirection ?? undefined,
        };
        const res = await tasksApi.listOpen(query);
        setRows(res.items.map(mapRow));
        setTotal(res.meta.total);
      } catch {
        appToast.error(MESSAGES.task.loadFailed);
      } finally {
        setTableLoading(false);
      }
    },
    [page, pageSize, search, sortDirection, sortKey],
  );

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    const t = setTimeout(() => {
      loadTasks({ pageOverride: 1 });
      setPage(1);
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sortKey, sortDirection]);

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const clearFilters = () => {
    setSortKey("createdAt");
    setSortDirection("desc");
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  const clearSelection = () => setSelectedIds([]);

  const openConfirm = (
    action: ConfirmAction,
    title: string,
    message: string,
    label: string,
    color: "error" | "success" | "primary",
    taskId?: string,
  ) => {
    setConfirmAction(action);
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmLabel(label);
    setConfirmColor(color);
    setSingleDeleteId(taskId ?? null);
    setConfirmOpen(true);
  };

  const openCompleteSelectedConfirm = () => {
    if (!selectedIds.length) return;
    openConfirm(
      "completeSelected",
      "Complete Action Items",
      `Mark ${selectedIds.length} item${selectedIds.length > 1 ? "s" : ""} as completed?`,
      "Yes, Complete",
      "success",
    );
  };

  const openDeleteSelectedConfirm = () => {
    if (!selectedIds.length) return;
    openConfirm(
      "deleteSelected",
      "Delete Action Items",
      `Delete ${selectedIds.length} selected item${selectedIds.length > 1 ? "s" : ""}? This cannot be undone.`,
      "Yes, Delete",
      "error",
    );
  };

  const openDeleteSingleConfirm = (task: ActionItemRow) => {
    openConfirm(
      "deleteSingle",
      "Delete Action Item",
      `Delete "${truncateRichPlainText(task.desc, 60)}"? This cannot be undone.`,
      "Yes, Delete",
      "error",
      task.id,
    );
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setConfirmAction(null);
    setSingleDeleteId(null);
  };

  const openTaskDetail = useCallback(async (task: ActionItemRow) => {
    setDetailTask(task);
    setDetailOpen(true);
    setDetailAttachments([]);
    setDetailAttachmentsLoading(true);
    try {
      const list = await tasksApi.listTaskAttachments(task.id);
      setDetailAttachments(list);
    } catch {
      appToast.error(MESSAGES.task.loadFailed);
    } finally {
      setDetailAttachmentsLoading(false);
    }
  }, []);

  const closeTaskDetail = useCallback(() => {
    setDetailOpen(false);
    setDetailTask(null);
    setDetailAttachments([]);
  }, []);

  const onConfirm = async () => {
    if (!confirmAction) return;
    setConfirmOpen(false);
    try {
      if (confirmAction === "completeSelected") {
        await tasksApi.bulkComplete(selectedIds);
        appToast.success(MESSAGES.task.completed);
        clearSelection();
      }
      if (confirmAction === "deleteSelected") {
        await tasksApi.bulkDelete(selectedIds);
        appToast.success(MESSAGES.task.deleted);
        clearSelection();
      }
      if (confirmAction === "deleteSingle" && singleDeleteId !== null) {
        await tasksApi.deleteOne(singleDeleteId);
        setSelectedIds((prev) => prev.filter((id) => id !== singleDeleteId));
        appToast.success(MESSAGES.task.deleted);
      }
      await loadStats();
      await loadTasks();
      emitTasksChanged();
    } catch {
      appToast.error(MESSAGES.common.somethingWrong);
    } finally {
      setConfirmAction(null);
      setSingleDeleteId(null);
    }
  };

  return {
    statsLoading,
    tableLoading,
    search,
    setSearch: (value: string) => {
      setSearch(value);
    },
    page,
    setPage,
    pageSize,
    total,
    rows,
    stats: {
      openTasks: stats.totalOpen,
      overdue10: stats.overdue10,
      completed: stats.totalCompleted,
      urgent: stats.urgent,
    },
    showFilters,
    setShowFilters,
    sortKey,
    sortDirection,
    onSortColumn: (key: SortKey) => {
      toggleSort(key);
      setPage(1);
    },
    sortDays: sortKey === "daysOpen" ? (sortDirection as "asc" | "desc") : null,
    setSortDays: (dir: "asc" | "desc") => {
      setSortKey("daysOpen");
      setSortDirection(dir);
      setPage(1);
    },
    clearFilters,
    selectedIds,
    toggleSelected,
    clearSelection,
    openCompleteSelectedConfirm,
    openDeleteSelectedConfirm,
    openDeleteSingleConfirm,
    detailOpen,
    detailTask,
    detailAttachments,
    detailAttachmentsLoading,
    openTaskDetail,
    closeTaskDetail,
    confirmOpen,
    confirmTitle,
    confirmMessage,
    confirmLabel,
    confirmColor,
    closeConfirm,
    onConfirm,
  };
}
