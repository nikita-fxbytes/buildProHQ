"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MESSAGES } from "@/constants/messages";
import { UI_DEFAULTS } from "@/constants/ui";
import { useTableSort } from "@/hooks/use-table-sort";
import { lookupsApi } from "@/services/lookupsApi.service";
import { tasksApi, type ListOpenTasksBody, type TaskListItem, type TaskStats } from "@/services/tasksApi.service";
import { usersApi, type UserListItem } from "@/services/usersApi.service";
import { projectsApi } from "@/services/projectsApi.service";
import { truncateRichPlainText } from "@/utils/richText";
import { appToast } from "@/utils/toast";
import { ROUTES } from "@/constants/routes";

type ConfirmAction = "completeSelected" | "deleteSelected" | "deleteSingle";
type SortKey = "level" | "trade" | "user" | "priority" | "description" | "daysOpen" | "createdAt";

export function useManagerTasksController(opts?: { mode?: "manager" | "super" }) {
  const mode = opts?.mode ?? "manager";
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Array<ReturnType<typeof mapRow>>>([]);
  const [stats, setStats] = useState<TaskStats>({
    totalOpen: 0,
    totalCompleted: 0,
    urgent: 0,
    overdue: 0,
    overdue10: 0,
    midRange7to10: 0,
    fresh0to6: 0,
    tradesActive: 0,
  });
  const [total, setTotal] = useState(0);
  const [tradeOptions, setTradeOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [levelOptions, setLevelOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [userOptions, setUserOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [projectOptions, setProjectOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [assignUsers, setAssignUsers] = useState<UserListItem[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [search, setSearch] = useState("");
  const [projectFilters, setProjectFilters] = useState<string[]>([]);
  const [tradeFilters, setTradeFilters] = useState<string[]>([]);
  const [levelFilters, setLevelFilters] = useState<string[]>([]);
  const [userFilters, setUserFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const { sortKey, sortDirection, toggleSort, setSortKey, setSortDirection } =
    useTableSort<SortKey>("createdAt");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmLabel, setConfirmLabel] = useState("Confirm");
  const [confirmColor, setConfirmColor] = useState<"error" | "success" | "primary">("error");
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [singleDeleteId, setSingleDeleteId] = useState<string | null>(null);

  const [assignOpen, setAssignOpen] = useState(false);
  const [assignTaskId, setAssignTaskId] = useState<string | null>(null);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignSubmitting, setAssignSubmitting] = useState(false);
  const [assigneeUserId, setAssigneeUserId] = useState<string | null>(null);

  const pageSize = UI_DEFAULTS.TASK_PAGE_SIZE;

  const loadLookups = useCallback(async () => {
    try {
      const [trades, levels, users, projects] = await Promise.all([
        lookupsApi.getTrades(),
        lookupsApi.getLevels(),
        usersApi.list(),
        mode === "super" ? projectsApi.listMine() : Promise.resolve([]),
      ]);
      setTradeOptions(trades.map((t) => ({ value: t.id, label: t.name })));
      setLevelOptions(levels.map((l) => ({ value: l.id, label: l.name })));
      setAssignUsers(users);
      setUsersCount(users.length);
      setUserOptions(
        users
          .filter((u) => Boolean(u.initials))
          .map((u) => ({ value: u.id, label: u.initials as string })),
      );
      setProjectOptions(projects.map((p) => ({ value: p.id, label: p.name })));
    } catch {
      // Non-fatal; page still works without filter options.
      setAssignUsers([]);
      setUsersCount(0);
    } finally {
      // no-op
    }
  }, [mode]);

  const loadStats = useCallback(async () => {
    try {
      const res = await tasksApi.getStats();
      setStats(res);
    } catch {
      // Non-fatal.
    }
  }, []);

  const loadTasks = useCallback(
    async (opts?: { pageOverride?: number }) => {
      setLoading(true);
      try {
        const queryPage = opts?.pageOverride ?? page;
        const querySearch = search.trim() || undefined;
        const query: ListOpenTasksBody = {
          page: queryPage,
          limit: pageSize,
          search: querySearch,
          sortBy: sortKey ? mapSortKey(sortKey) : undefined,
          sortOrder: sortDirection ?? undefined,
          filters: ({
            projectIds: mode === "super" ? projectFilters : undefined,
            tradeIds: tradeFilters,
            levelIds: levelFilters,
            createdByUserIds: userFilters,
          } satisfies NonNullable<ListOpenTasksBody["filters"]>),
        };
        const res = await tasksApi.listOpen(query);
        setRows(res.items.map((r) => mapRow(r, { withProject: mode === "super" })));
        setTotal(res.meta.total);
      } catch {
        appToast.error(MESSAGES.task.loadFailed);
      } finally {
        setLoading(false);
      }
    },
    [
      levelFilters,
      mode,
      page,
      pageSize,
      projectFilters,
      search,
      sortDirection,
      sortKey,
      tradeFilters,
      userFilters,
    ],
  );

  useEffect(() => {
    loadLookups();
    loadStats();
  }, [loadLookups, loadStats]);

  useEffect(() => {
    const t = setTimeout(() => {
      loadTasks({ pageOverride: 1 });
      setPage(1);
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, projectFilters, tradeFilters, levelFilters, userFilters, sortKey, sortDirection]);

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const toggleFilterValue = (current: string[], value: string) =>
    current.includes(value) ? current.filter((v) => v !== value) : [...current, value];

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

  const onConfirm = async () => {
    setConfirmOpen(false);
    if (!confirmAction) return;
    try {
      if (confirmAction === "completeSelected") {
        await tasksApi.bulkComplete(selectedIds);
        appToast.success(MESSAGES.task.completed);
        setSelectedIds([]);
      }
      if (confirmAction === "deleteSelected") {
        await tasksApi.bulkDelete(selectedIds);
        appToast.success(MESSAGES.task.deleted);
        setSelectedIds([]);
      }
      if (confirmAction === "deleteSingle" && singleDeleteId !== null) {
        await tasksApi.deleteOne(singleDeleteId);
        setSelectedIds((prev) => prev.filter((id) => id !== singleDeleteId));
        appToast.success(MESSAGES.task.deleted);
      }
      await loadStats();
      await loadTasks();
      window.dispatchEvent(new Event("buildprohq:tasksChanged"));
    } catch {
      appToast.error(MESSAGES.common.saveFailed);
    } finally {
      setConfirmAction(null);
      setSingleDeleteId(null);
    }
  };

  const assignUserOptions = useMemo(
    () =>
      assignUsers.map((u) => ({
        value: u.id,
        label: `${u.full_name} (${u.user_type_name})`,
      })),
    [assignUsers],
  );

  const openAssign = useCallback(async (taskId: string) => {
    setAssignOpen(true);
    setAssignTaskId(taskId);
    setAssignLoading(true);
    try {
      const task = await tasksApi.getById(taskId);
      setAssigneeUserId((task.assigned_to_user_id as string | null) ?? null);
    } catch {
      setAssigneeUserId(null);
      // Keep dialog open so user can still assign if needed.
    } finally {
      setAssignLoading(false);
    }
  }, []);

  const closeAssign = () => {
    setAssignOpen(false);
    setAssignTaskId(null);
    setAssigneeUserId(null);
  };

  const saveAssign = useCallback(async () => {
    if (!assignTaskId) return;
    setAssignSubmitting(true);
    try {
      if (assigneeUserId) {
        await tasksApi.assign(assignTaskId, { assigneeUserId });
      } else {
        await tasksApi.update(assignTaskId, { assignedToUserId: null });
      }
      appToast.success(MESSAGES.task.updated);
      closeAssign();
      await loadStats();
      await loadTasks();
      window.dispatchEvent(new Event("buildprohq:tasksChanged"));
    } catch {
      appToast.error(MESSAGES.common.saveFailed);
    } finally {
      setAssignSubmitting(false);
    }
  }, [assignTaskId, assigneeUserId, loadStats, loadTasks]);

  const goToEdit = (taskId: string) => {
    // Task edit is a full page (super route).
    router.push(`${ROUTES.SUPER_TASKS}/edit/${taskId}`);
  };

  return {
    showProjectColumn: mode === "super",
    loading,
    search,
    setSearch,
    showFilters,
    setShowFilters,
    projectOptions,
    tradeOptions,
    levelOptions,
    userOptions,
    projectFilters,
    tradeFilters,
    levelFilters,
    userFilters,
    setProjectFiltersDirect: setProjectFilters,
    setTradeFiltersDirect: setTradeFilters,
    setLevelFiltersDirect: setLevelFilters,
    setUserFiltersDirect: setUserFilters,
    setProjectFilters: (value: string) => setProjectFilters((prev) => toggleFilterValue(prev, value)),
    setTradeFilters: (value: string) => setTradeFilters((prev) => toggleFilterValue(prev, value)),
    setLevelFilters: (value: string) => setLevelFilters((prev) => toggleFilterValue(prev, value)),
    setUserFilters: (value: string) => setUserFilters((prev) => toggleFilterValue(prev, value)),
    clearFilters: () => {
      setProjectFilters([]);
      setTradeFilters([]);
      setLevelFilters([]);
      setUserFilters([]);
      setSortKey("createdAt");
      setSortDirection("desc");
    },
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
    selectedIds,
    toggleSelected: (id: string) =>
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
    openDeleteSingleConfirm: (task: ReturnType<typeof mapRow>) =>
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
    goToEdit,
    openAssign,
    assignOpen,
    assignLoading,
    assignSubmitting,
    assignUserOptions,
    assigneeUserId,
    setAssigneeUserId,
    closeAssign,
    saveAssign,
    rows,
    page,
    pageSize,
    total,
    onPageChange: setPage,
    stats: {
      totalOpen: stats.totalOpen,
      overdue: stats.overdue10,
      completedStub: stats.totalCompleted,
      activeUsers: usersCount,
    },
  };
}

const toInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0])
    .join("")
    .slice(0, 4)
    .toUpperCase();

const mapRow = (row: TaskListItem, opts?: { withProject?: boolean }) => ({
  id: row.id,
  project: opts?.withProject ? (row.project_name ?? "-") : undefined,
  level: row.level_name ?? "-",
  trade: row.trade_name ?? "-",
  user:
    row.created_by_initials ??
    (row.created_by_full_name ? toInitials(row.created_by_full_name) : "-"),
  priority: row.priority_name ?? "-",
  desc: row.description,
  days: row.days_open ?? 0,
});

const mapSortKey = (key: SortKey): ListOpenTasksBody["sortBy"] => {
  if (key === "user") return "user";
  if (key === "priority") return "priority";
  if (key === "daysOpen") return "daysOpen";
  if (key === "description") return "description";
  if (key === "trade") return "trade";
  if (key === "level") return "level";
  return "createdAt";
};

