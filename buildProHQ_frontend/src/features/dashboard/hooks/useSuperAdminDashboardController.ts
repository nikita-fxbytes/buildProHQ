"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MESSAGES } from "@/constants/messages";
import { appToast } from "@/utils/toast";
import { tasksApi, type TaskListItem, type TaskStats } from "@/services/tasksApi.service";
import { usersApi, type UserListItem } from "@/services/usersApi.service";
import { taskBelongsToUserForSnapshot, type SuperDashboardRoleTab } from "@/features/dashboard/super-admin/taskUserMatch";

type Summary = {
  openTasks: number;
  completedTasks: number;
  overdueTasks: number;
  totalUsers: number;
};

export type SuperUsersSortKey =
  | "createdAt_desc"
  | "createdAt_asc"
  | "name_asc"
  | "name_desc"
  | "email_asc"
  | "email_desc"
  | "tasks_desc"
  | "tasks_asc"
  | "lastLoginAt_desc"
  | "lastLoginAt_asc";

function mapUserSort(key: SuperUsersSortKey): { sortBy: NonNullable<Parameters<typeof usersApi.search>[0]["sortBy"]>; sortOrder: "asc" | "desc" } {
  switch (key) {
    case "createdAt_asc":
      return { sortBy: "createdAt", sortOrder: "asc" };
    case "createdAt_desc":
      return { sortBy: "createdAt", sortOrder: "desc" };
    case "name_asc":
      return { sortBy: "name", sortOrder: "asc" };
    case "name_desc":
      return { sortBy: "name", sortOrder: "desc" };
    case "email_asc":
      return { sortBy: "email", sortOrder: "asc" };
    case "email_desc":
      return { sortBy: "email", sortOrder: "desc" };
    case "tasks_asc":
      return { sortBy: "tasks", sortOrder: "asc" };
    case "tasks_desc":
      return { sortBy: "tasks", sortOrder: "desc" };
    case "lastLoginAt_asc":
      return { sortBy: "lastLoginAt", sortOrder: "asc" };
    case "lastLoginAt_desc":
      return { sortBy: "lastLoginAt", sortOrder: "desc" };
    default:
      return { sortBy: "createdAt", sortOrder: "desc" };
  }
}

export function useSuperAdminDashboardController() {
  const pageSize = 10;
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<SuperDashboardRoleTab>("Management");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [roleUsersLoading, setRoleUsersLoading] = useState(true);
  const [roleUsers, setRoleUsers] = useState<UserListItem[]>([]);
  const [roleUsersMeta, setRoleUsersMeta] = useState<{ page: number; limit: number; total: number; totalPages: number }>({
    page: 1,
    limit: pageSize,
    total: 0,
    totalPages: 1,
  });
  const [roleUsersSearch, setRoleUsersSearch] = useState("");
  const [roleUsersSort, setRoleUsersSort] = useState<SuperUsersSortKey>("createdAt_desc");
  const [page, setPage] = useState(1);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<UserListItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailSnapshot, setDetailSnapshot] = useState<TaskListItem[]>([]);
  const [detailProjectsApprox, setDetailProjectsApprox] = useState<number | null>(null);

  const roleUsersReqIdRef = useRef(0);
  const detailReqIdRef = useRef(0);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    try {
      const [stats, managersRes, tradeRes, fieldRes] = await Promise.all([
        tasksApi.getStats({ scope: "all" }),
        usersApi.search({ page: 1, limit: 1, role: "Management" }),
        usersApi.search({ page: 1, limit: 1, role: "Trade" }),
        usersApi.search({ page: 1, limit: 1, role: "User" }),
      ]);

      const s: TaskStats = stats;
      const totalUsers = managersRes.meta.total + tradeRes.meta.total + fieldRes.meta.total;
      setSummary({
        openTasks: s.open ?? s.totalOpen ?? 0,
        completedTasks: s.completed ?? s.totalCompleted ?? 0,
        overdueTasks: s.overdueDue ?? s.overdue ?? 0,
        totalUsers,
      });
    } catch {
      appToast.error(MESSAGES.common.somethingWrong);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRoleUsers = useCallback(async (role: SuperDashboardRoleTab, query: { page: number; limit: number; search: string; sort: SuperUsersSortKey }) => {
    const reqId = (roleUsersReqIdRef.current += 1);
    setRoleUsersLoading(true);
    try {
      const sort = mapUserSort(query.sort);
      const res = await usersApi.search({
        page: query.page,
        limit: query.limit,
        role,
        search: query.search.trim() || undefined,
        sortBy: sort.sortBy,
        sortOrder: sort.sortOrder,
      });
      if (reqId !== roleUsersReqIdRef.current) return;
      // Defensive: Super Admin should never show inside role tabs even if backend regresses.
      setRoleUsers(res.items.filter((u) => !u.is_super_admin));
      setRoleUsersMeta(res.meta);
    } catch {
      if (reqId !== roleUsersReqIdRef.current) return;
      appToast.error(MESSAGES.common.somethingWrong);
      setRoleUsers([]);
      setRoleUsersMeta({ page: 1, limit: query.limit, total: 0, totalPages: 1 });
    } finally {
      if (reqId !== roleUsersReqIdRef.current) return;
      setRoleUsersLoading(false);
    }
  }, []);

  const loadUserDetailSnapshot = useCallback(async (user: UserListItem, role: SuperDashboardRoleTab) => {
    const reqId = (detailReqIdRef.current += 1);
    setDetailLoading(true);
    setDetailSnapshot([]);
    setDetailProjectsApprox(null);
    try {
      const res = await tasksApi.listOpen({
        page: 1,
        limit: 100,
        sortBy: "daysOpen",
        sortOrder: "desc",
      });
      if (reqId !== detailReqIdRef.current) return;
      const mine = res.items.filter((t) => taskBelongsToUserForSnapshot(t, role, user.id));
      const top = mine.slice(0, 3);
      setDetailSnapshot(top);
      const projectIds = new Set<string>();
      for (const t of mine) {
        if (t.project_id) projectIds.add(t.project_id);
      }
      setDetailProjectsApprox(projectIds.size);
    } catch {
      if (reqId !== detailReqIdRef.current) return;
      appToast.error(MESSAGES.common.somethingWrong);
      setDetailSnapshot([]);
      setDetailProjectsApprox(null);
    } finally {
      if (reqId !== detailReqIdRef.current) return;
      setDetailLoading(false);
    }
  }, []);

  const openUserDetails = useCallback((user: UserListItem) => {
    setDetailLoading(true);
    setDetailUser(user);
    setDetailOpen(true);
  }, []);

  const closeUserDetails = useCallback(() => {
    detailReqIdRef.current += 1; // invalidate any in-flight snapshot request
    setDetailOpen(false);
    setDetailUser(null);
    setDetailSnapshot([]);
    setDetailProjectsApprox(null);
    setDetailLoading(false);
  }, []);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    void loadRoleUsers(tab, { page, limit: pageSize, search: roleUsersSearch, sort: roleUsersSort });
  }, [loadRoleUsers, tab, page, pageSize, roleUsersSearch, roleUsersSort]);

  useEffect(() => {
    if (!detailOpen || !detailUser) return;
    void loadUserDetailSnapshot(detailUser, tab);
  }, [tab, detailOpen, detailUser, loadUserDetailSnapshot]);

  const initialLoading = useMemo(() => loading && !summary, [loading, summary]);

  return {
    loading,
    initialLoading,
    summary,
    tab,
    setTab: (next: SuperDashboardRoleTab) => {
      setTab(next);
      setPage(1);
    },
    roleUsersLoading,
    roleUsers,
    roleUsersMeta,
    roleUsersSearch,
    setRoleUsersSearch: (value: string) => {
      setRoleUsersSearch(value);
      setPage(1);
    },
    roleUsersSort,
    setRoleUsersSort: (value: SuperUsersSortKey) => {
      setRoleUsersSort(value);
      setPage(1);
    },
    page,
    setPage,
    pageSize,
    reload: loadSummary,
    detailOpen,
    detailUser,
    detailLoading,
    detailSnapshotTasks: detailSnapshot,
    detailProjectsApprox,
    openUserDetails,
    closeUserDetails,
  };
}
