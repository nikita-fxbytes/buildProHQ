"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MESSAGES } from "@/constants/messages";
import { appToast } from "@/utils/toast";
import { tasksApi, type TaskStats } from "@/services/tasksApi.service";
import { usersApi, type UserListItem } from "@/services/usersApi.service";

type RoleTab = "Management" | "Trade" | "User";

type Summary = {
  openTasks: number;
  completedTasks: number;
  overdueTasks: number;
  totalUsers: number;
};

export function useSuperAdminDashboardController() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<RoleTab>("Management");
  const [summary, setSummary] = useState<Summary | null>(null);
  const [roleUsersLoading, setRoleUsersLoading] = useState(true);
  const [roleUsers, setRoleUsers] = useState<UserListItem[]>([]);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    try {
      const [stats, managersRes, tradeRes, fieldRes] = await Promise.all([
        tasksApi.getStats(),
        usersApi.search({ page: 1, limit: 1, role: "Management" }),
        usersApi.search({ page: 1, limit: 1, role: "Trade" }),
        usersApi.search({ page: 1, limit: 1, role: "User" }),
      ]);

      const s: TaskStats = stats;
      const totalUsers = managersRes.meta.total + tradeRes.meta.total + fieldRes.meta.total;
      setSummary({
        openTasks: s.totalOpen,
        completedTasks: s.totalCompleted,
        overdueTasks: s.overdue10,
        totalUsers,
      });
    } catch {
      appToast.error(MESSAGES.common.somethingWrong);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRoleUsers = useCallback(
    async (role: RoleTab) => {
      setRoleUsersLoading(true);
      try {
        const res = await usersApi.search({
          page: 1,
          limit: 12,
          role,
          sortBy: "createdAt",
          sortOrder: "desc",
        });
        setRoleUsers(res.items);
      } catch {
        appToast.error(MESSAGES.common.somethingWrong);
        setRoleUsers([]);
      } finally {
        setRoleUsersLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    void loadRoleUsers(tab);
  }, [loadRoleUsers, tab]);

  const initialLoading = useMemo(() => loading && !summary, [loading, summary]);

  return {
    loading,
    initialLoading,
    summary,
    tab,
    setTab,
    roleUsersLoading,
    roleUsers,
    reload: loadSummary,
  };
}

