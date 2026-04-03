"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MESSAGES } from "@/constants/messages";
import { UI_DEFAULTS } from "@/constants/ui";
import { taskService } from "@/services/task.service";
import { userService } from "@/services/user.service";
import type { Task, User } from "@/types/domain";
import { htmlToPlainText, truncateRichPlainText } from "@/utils/richText";
import { appToast } from "@/utils/toast";

type Sort = "asc" | "desc" | null;
type ConfirmAction = "completeSelected" | "deleteSelected" | "deleteSingle";

export function useManagerTasksController() {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [tradeFilters, setTradeFilters] = useState<string[]>([]);
  const [levelFilters, setLevelFilters] = useState<string[]>([]);
  const [userFilters, setUserFilters] = useState<string[]>([]);
  const [sortDays, setSortDays] = useState<Sort>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmLabel, setConfirmLabel] = useState("Confirm");
  const [confirmColor, setConfirmColor] = useState<"error" | "success" | "primary">("error");
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [singleDeleteId, setSingleDeleteId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [taskRows, userRows] = await Promise.all([taskService.getTasks(), userService.getUsers()]);
      setTasks(taskRows);
      setUsers(userRows);
    } catch {
      appToast.error(MESSAGES.task.loadFailed);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const tradeOptions = useMemo(
    () => [...new Set(tasks.map((task) => task.trade))],
    [tasks],
  );
  const levelOptions = useMemo(
    () => [...new Set(tasks.map((task) => task.level))].sort(),
    [tasks],
  );
  const userOptions = useMemo(
    () => [...new Set(users.map((user) => user.initials))],
    [users],
  );

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    let rows = tasks.filter((task) => {
      if (tradeFilters.length && !tradeFilters.includes(task.trade)) return false;
      if (levelFilters.length && !levelFilters.includes(task.level)) return false;
      if (userFilters.length && !userFilters.includes(task.user)) return false;
      if (
        query &&
        !`${task.level} ${task.trade} ${htmlToPlainText(task.desc)} ${task.user}`
          .toLowerCase()
          .includes(query)
      ) {
        return false;
      }
      return true;
    });
    if (sortDays === "asc") rows = [...rows].sort((a, b) => a.days - b.days);
    if (sortDays === "desc") rows = [...rows].sort((a, b) => b.days - a.days);
    return rows;
  }, [levelFilters, search, sortDays, tasks, tradeFilters, userFilters]);

  const pageSize = UI_DEFAULTS.TASK_PAGE_SIZE;
  const total = filteredTasks.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), pages);
  const pageRows = filteredTasks.slice((safePage - 1) * pageSize, safePage * pageSize);

  const stats = useMemo(() => {
    const overdue = tasks.filter((task) => task.days > 10).length;
    return {
      totalOpen: tasks.length,
      overdue,
      completedStub: 0,
      activeUsers: users.length,
    };
  }, [tasks, users]);

  const toggleFilterValue = (values: string[], value: string) =>
    values.includes(value) ? values.filter((v) => v !== value) : [...values, value];

  const openConfirm = (
    action: ConfirmAction,
    title: string,
    message: string,
    label: string,
    color: "error" | "success" | "primary",
    taskId?: number,
  ) => {
    setConfirmAction(action);
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmLabel(label);
    setConfirmColor(color);
    setSingleDeleteId(taskId ?? null);
    setConfirmOpen(true);
  };

  const onConfirm = async () => {
    setConfirmOpen(false);
    if (!confirmAction) return;
    try {
      if (confirmAction === "completeSelected") {
        await taskService.completeTasks(selectedIds);
        appToast.success(MESSAGES.task.completed);
        setSelectedIds([]);
      }
      if (confirmAction === "deleteSelected") {
        await taskService.deleteTasks(selectedIds);
        appToast.success(MESSAGES.task.deleted);
        setSelectedIds([]);
      }
      if (confirmAction === "deleteSingle" && singleDeleteId !== null) {
        await taskService.deleteTasks([singleDeleteId]);
        setSelectedIds((prev) => prev.filter((id) => id !== singleDeleteId));
        appToast.success(MESSAGES.task.deleted);
      }
      await load();
    } catch {
      appToast.error(MESSAGES.common.saveFailed);
    } finally {
      setConfirmAction(null);
      setSingleDeleteId(null);
    }
  };

  return {
    loading,
    search,
    setSearch,
    showFilters,
    setShowFilters,
    tradeOptions,
    levelOptions,
    userOptions,
    tradeFilters,
    levelFilters,
    userFilters,
    setTradeFilters: (value: string) => setTradeFilters((prev) => toggleFilterValue(prev, value)),
    setLevelFilters: (value: string) => setLevelFilters((prev) => toggleFilterValue(prev, value)),
    setUserFilters: (value: string) => setUserFilters((prev) => toggleFilterValue(prev, value)),
    clearFilters: () => {
      setTradeFilters([]);
      setLevelFilters([]);
      setUserFilters([]);
      setSortDays(null);
      setPage(1);
    },
    sortDays,
    toggleSort: (dir: "asc" | "desc") => {
      setSortDays((current) => (current === dir ? null : dir));
      setPage(1);
    },
    selectedIds,
    toggleSelected: (id: number) =>
      setSelectedIds((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id])),
    clearSelected: () => setSelectedIds([]),
    openCompleteSelectedConfirm: () =>
      openConfirm(
        "completeSelected",
        "Complete Tasks",
        `Mark ${selectedIds.length} task${selectedIds.length > 1 ? "s" : ""} as complete? This cannot be undone.`,
        "Yes, Complete",
        "success",
      ),
    openDeleteSelectedConfirm: () =>
      openConfirm(
        "deleteSelected",
        "Delete Tasks",
        `Permanently delete ${selectedIds.length} task${selectedIds.length > 1 ? "s" : ""}? They will not appear in Completed.`,
        "Yes, Delete",
        "error",
      ),
    openDeleteSingleConfirm: (task: Task) =>
      openConfirm(
        "deleteSingle",
        "Delete Task",
        `Delete "${truncateRichPlainText(task.desc, 60)}"? This cannot be undone.`,
        "Yes, Delete",
        "error",
        task.id,
      ),
    confirmOpen,
    confirmTitle,
    confirmMessage,
    confirmLabel,
    confirmColor,
    closeConfirm: () => setConfirmOpen(false),
    onConfirm,
    rows: pageRows,
    page: safePage,
    pageSize,
    total,
    onPageChange: setPage,
    stats,
  };
}

