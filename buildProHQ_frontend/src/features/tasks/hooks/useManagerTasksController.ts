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
import { taskRoutes } from "@/constants/routes";
import { computeDaysToDeadline } from "@/utils/taskDeadline";
import {
  loadTaskListFilters,
  saveTaskListFilters,
  type TaskListFilterKey,
} from "@/features/tasks/storage/taskListFiltersStorage";

type ConfirmAction = "completeSelected" | "deleteSelected" | "deleteSingle";
type SortKey =
  | "projectName"
  | "title"
  | "level"
  | "trade"
  | "user"
  | "assignees"
  | "priority"
  | "description"
  | "daysOpen"
  | "createdAt";

function initSearchFromStorage(): string {
  if (typeof window === "undefined") return "";
  return loadTaskListFilters()?.search ?? "";
}

function initArrFromStorage(key: TaskListFilterKey): string[] {
  if (typeof window === "undefined") return [];
  if (key === "search") return [];
  const v = loadTaskListFilters()?.[key];
  return Array.isArray(v) ? v : [];
}

const ALLOWED_STATUS_NAMES = new Set(["Open", "In Progress", "Completed"]);

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
  const [statusOptions, setStatusOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [priorityOptions, setPriorityOptions] = useState<Array<{ value: string; label: string }>>(
    [],
  );
  const [userOptions, setUserOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [projectOptions, setProjectOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [assignUsers, setAssignUsers] = useState<UserListItem[]>([]);
  const [usersCount, setUsersCount] = useState(0);
  const [search, setSearch] = useState(initSearchFromStorage);
  const [projectFilters, setProjectFilters] = useState<string[]>(() =>
    initArrFromStorage("projectFilters"),
  );
  const [tradeFilters, setTradeFilters] = useState<string[]>(() => initArrFromStorage("tradeFilters"));
  const [levelFilters, setLevelFilters] = useState<string[]>(() => initArrFromStorage("levelFilters"));
  const [userFilters, setUserFilters] = useState<string[]>(() => initArrFromStorage("userFilters"));
  const [statusFilters, setStatusFilters] = useState<string[]>(() => initArrFromStorage("statusFilters"));
  const [priorityFilters, setPriorityFilters] = useState<string[]>(() =>
    initArrFromStorage("priorityFilters"),
  );
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
  const [assigneeUserIds, setAssigneeUserIds] = useState<string[]>([]);

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusTaskId, setStatusTaskId] = useState<string | null>(null);
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [statusValue, setStatusValue] = useState<string>("Open");

  const pageSize = UI_DEFAULTS.TASK_PAGE_SIZE;
  const showSuperTaskRoutes = mode === "super";

  const loadLookups = useCallback(async () => {
    try {
      const [trades, levels, statusesAll, priorities, users, projects] = await Promise.all([
        lookupsApi.getTrades(),
        lookupsApi.getLevels(),
        lookupsApi.getTaskStatuses(),
        lookupsApi.getTaskPriorities(),
        usersApi.list(),
        mode === "super" ? projectsApi.listMine() : Promise.resolve([]),
      ]);
      setTradeOptions(trades.map((t) => ({ value: t.id, label: t.name })));
      setLevelOptions(levels.map((l) => ({ value: l.id, label: l.name })));
      const statuses = statusesAll.filter((s) => ALLOWED_STATUS_NAMES.has(s.name));
      setStatusOptions(statuses.map((s) => ({ value: s.id, label: s.name })));
      setPriorityOptions(
        priorities.map((p) => ({
          value: p.id,
          label: p.name.toLowerCase() === "critical" ? "Urgent" : p.name,
        })),
      );
      setAssignUsers(users);
      setUsersCount(users.length);
      setUserOptions(
        users.map((u) => ({
          value: u.id,
          label: `${u.full_name} (${u.user_type_name})`,
        })),
      );
      setProjectOptions(projects.map((p) => ({ value: p.id, label: p.name })));
    } catch {
      setAssignUsers([]);
      setUsersCount(0);
    }
  }, [mode]);

  const loadStats = useCallback(async () => {
    try {
      const res = await tasksApi.getStats({
        search: search.trim() || undefined,
        filters: {
          projectIds: mode === "super" ? projectFilters : undefined,
          tradeIds: tradeFilters,
          levelIds: levelFilters,
          createdByUserIds: userFilters,
          statusIds: statusFilters.length ? statusFilters : undefined,
          priorityIds: priorityFilters.length ? priorityFilters : undefined,
        },
      });
      // Debug: verify backend keys (open/today/total vs legacy totals)
      // eslint-disable-next-line no-console
      console.log("TASK STATS:", res);
      setStats(res);
    } catch {
      // Non-fatal.
    }
  }, [levelFilters, mode, priorityFilters, projectFilters, search, statusFilters, tradeFilters, userFilters]);

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
          filters: {
            projectIds: mode === "super" ? projectFilters : undefined,
            tradeIds: tradeFilters,
            levelIds: levelFilters,
            createdByUserIds: userFilters,
            statusIds: statusFilters.length ? statusFilters : undefined,
            priorityIds: priorityFilters.length ? priorityFilters : undefined,
          },
        };
        const res = await tasksApi.listAll(query);
        // Debug logs removed for production readiness.
        setRows(res.items.map((r) => mapRow(r, { withProject: mode === "super", users: assignUsers })));
        setTotal(res.meta.total);
      } catch {
        appToast.error(MESSAGES.task.loadFailed);
      } finally {
        setLoading(false);
      }
    },
    [
      assignUsers,
      levelFilters,
      mode,
      page,
      pageSize,
      projectFilters,
      search,
      sortDirection,
      sortKey,
      statusFilters,
      tradeFilters,
      userFilters,
      priorityFilters,
    ],
  );

  useEffect(() => {
    loadLookups();
    loadStats();
  }, [loadLookups, loadStats]);

  // Keep cards in sync with filters/search (debounced like list load)
  useEffect(() => {
    const t = setTimeout(() => {
      void loadStats();
    }, 250);
    return () => clearTimeout(t);
  }, [search, projectFilters, tradeFilters, levelFilters, userFilters, statusFilters, priorityFilters, loadStats]);

  useEffect(() => {
    const t = setTimeout(() => {
      loadTasks({ pageOverride: 1 });
      setPage(1);
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, projectFilters, tradeFilters, levelFilters, userFilters, statusFilters, sortKey, sortDirection]);

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  /** Persist filter chips + search so navigating away and back keeps selections. */
  useEffect(() => {
    const t = setTimeout(() => {
      saveTaskListFilters({
        search,
        projectFilters,
        tradeFilters,
        levelFilters,
        userFilters,
        statusFilters,
        priorityFilters,
      });
    }, 300);
    return () => clearTimeout(t);
  }, [search, projectFilters, tradeFilters, levelFilters, userFilters, statusFilters, priorityFilters]);

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

  const openAssign = useCallback(async (taskId: string, preselectIds?: string[]) => {
    setAssignOpen(true);
    setAssignTaskId(taskId);
    setAssignLoading(true);
    try {
      // Prefer row-provided assignees (fast + correct). Fall back to task detail.
      if (Array.isArray(preselectIds) && preselectIds.length) {
        setAssigneeUserIds(Array.from(new Set(preselectIds.filter(Boolean))));
        return;
      }
      const task = await tasksApi.getById(taskId);
      const ids =
        (task.assigned_to_user_ids as string[] | undefined) ??
        ((task.assigned_to_user_id ? [task.assigned_to_user_id] : []) as string[]);
      setAssigneeUserIds(Array.from(new Set((ids ?? []).filter(Boolean))));
    } catch {
      setAssigneeUserIds([]);
    } finally {
      setAssignLoading(false);
    }
  }, []);

  const closeAssign = () => {
    setAssignOpen(false);
    setAssignTaskId(null);
    setAssigneeUserIds([]);
  };

  const saveAssign = useCallback(async () => {
    if (!assignTaskId) return;
    setAssignSubmitting(true);
    try {
      await tasksApi.update(assignTaskId, { assignedToUserIds: assigneeUserIds });
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
  }, [assignTaskId, assigneeUserIds, loadStats, loadTasks]);

  const goToEdit = useCallback(
    (taskId: string) => {
      if (!showSuperTaskRoutes) return;
      router.push(taskRoutes.superEdit(taskId));
    },
    [router, showSuperTaskRoutes],
  );

  const goToView = useCallback(
    (taskId: string) => {
      if (!showSuperTaskRoutes) return;
      router.push(taskRoutes.superView(taskId));
    },
    [router, showSuperTaskRoutes],
  );

  const openStatusChange = useCallback(
    (taskId: string, currentStatusName?: string) => {
      if (!showSuperTaskRoutes) return;
      setStatusTaskId(taskId);
      setStatusValue(currentStatusName ?? "Open");
      setStatusOpen(true);
    },
    [showSuperTaskRoutes],
  );

  const closeStatusChange = () => {
    setStatusOpen(false);
    setStatusTaskId(null);
  };

  const saveStatusChange = useCallback(async () => {
    if (!statusTaskId) return;
    setStatusSubmitting(true);
    try {
      await tasksApi.updateStatus(statusTaskId, { status: statusValue as any });
      setRows((prev) =>
        prev.map((r) => (r.id === statusTaskId ? { ...r, status: statusValue } : r)),
      );
      appToast.success(MESSAGES.task.updated);
      void loadStats();
    } catch {
      appToast.error(MESSAGES.common.saveFailed);
    } finally {
      setStatusSubmitting(false);
      closeStatusChange();
    }
  }, [loadStats, statusTaskId, statusValue]);

  return {
    showProjectColumn: mode === "super",
    showSuperTaskRoutes,
    loading,
    search,
    setSearch,
    showFilters,
    setShowFilters,
    projectOptions,
    tradeOptions,
    levelOptions,
    statusOptions,
    priorityOptions,
    userOptions,
    projectFilters,
    tradeFilters,
    levelFilters,
    userFilters,
    statusFilters,
    priorityFilters,
    setProjectFiltersDirect: setProjectFilters,
    setTradeFiltersDirect: setTradeFilters,
    setLevelFiltersDirect: setLevelFilters,
    setUserFiltersDirect: setUserFilters,
    setStatusFiltersDirect: setStatusFilters,
    setPriorityFiltersDirect: setPriorityFilters,
    setProjectFilters: (value: string) => setProjectFilters((prev) => toggleFilterValue(prev, value)),
    setTradeFilters: (value: string) => setTradeFilters((prev) => toggleFilterValue(prev, value)),
    setLevelFilters: (value: string) => setLevelFilters((prev) => toggleFilterValue(prev, value)),
    setUserFilters: (value: string) => setUserFilters((prev) => toggleFilterValue(prev, value)),
    setStatusFilters: (value: string) => setStatusFilters((prev) => toggleFilterValue(prev, value)),
    setPriorityFilters: (value: string) => setPriorityFilters((prev) => toggleFilterValue(prev, value)),
    clearFilters: () => {
      setProjectFilters([]);
      setTradeFilters([]);
      setLevelFilters([]);
      setUserFilters([]);
      setStatusFilters([]);
      setPriorityFilters([]);
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
    goToView,
    openStatusChange,
    statusOpen,
    statusValue,
    setStatusValue,
    statusSubmitting,
    closeStatusChange,
    saveStatusChange,
    openAssign,
    assignOpen,
    assignLoading,
    assignSubmitting,
    assignUserOptions,
    assigneeUserIds,
    setAssigneeUserIds,
    closeAssign,
    saveAssign,
    rows,
    page,
    pageSize,
    total,
    onPageChange: setPage,
    stats: {
      totalOpen: stats.open ?? stats.totalOpen ?? 0,
      today: stats.today ?? 0,
      totalTasks: stats.total ?? stats.totalTasks ?? 0,
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

const mapRow = (
  row: TaskListItem,
  opts?: { withProject?: boolean; users?: UserListItem[] },
) => {
  const assignedUsers = Array.isArray(row.assigned_users) ? row.assigned_users : [];
  const namesFromApi = assignedUsers.map((u) => String(u?.fullName ?? "").trim()).filter(Boolean);

  const idsRaw =
    (Array.isArray(row.assigned_to_user_ids) ? row.assigned_to_user_ids : null) ??
    (row.assigned_to_user_id ? [row.assigned_to_user_id] : []);
  const ids = Array.isArray(idsRaw) ? idsRaw.filter(Boolean) : [];
  const users = Array.isArray(opts?.users) ? opts?.users : [];
  const namesFromLookup = ids
    .map((id) => users.find((u) => u.id === id))
    .filter(Boolean)
    .map((u) => u!.full_name);

  const names = namesFromApi.length ? namesFromApi : namesFromLookup;
  const visible = names.slice(0, 2);
  const more = Math.max(0, names.length - visible.length);
  const assigneesLabel = names.length
    ? `${visible.join(", ")}${more > 0 ? ` +${more} more` : ""}`
    : "Unassigned";

  return {
  id: row.id,
  title: (row.title ?? "").trim() || "-",
  project: opts?.withProject ? (row.project_name ?? "-") : undefined,
  level: row.level_name ?? "-",
  trade: row.trade_name ?? "-",
  user:
    row.created_by_initials ??
    (row.created_by_full_name ? toInitials(row.created_by_full_name) : "-"),
  assignees: assigneesLabel,
  assigneeIds: ids,
  priority: row.priority_name ?? "-",
  status: row.status_name ?? "Open",
  desc: row.description,
  /** Days since opened (legacy / secondary). */
  days: row.days_open ?? 0,
  dueAt: row.due_at ?? null,
  daysToDeadline: computeDaysToDeadline(row.due_at),
  };
};

const mapSortKey = (key: SortKey): ListOpenTasksBody["sortBy"] => {
  if (key === "user") return "user";
  if (key === "assignees") return "assignedUser";
  if (key === "title") return "title";
  if (key === "projectName") return "projectName";
  if (key === "priority") return "priority";
  if (key === "daysOpen") return "daysOpen";
  if (key === "description") return "description";
  if (key === "trade") return "trade";
  if (key === "level") return "level";
  return "createdAt";
};
