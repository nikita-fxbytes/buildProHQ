"use client";

import { useCallback, useEffect, useState } from "react";
import { UI_DEFAULTS } from "@/constants/ui";
import { MESSAGES } from "@/constants/messages";
import { userService } from "@/services/user.service";
import type { ManagerUsersListItem, ManagerUsersListQuery } from "@/types/domain";
import { appToast } from "@/utils/toast";

type RoleFilter = "" | "User" | "Trade" | "Management";

export function useManagerUsersListController() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(UI_DEFAULTS.USER_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<ManagerUsersListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteUserId, setPendingDeleteUserId] = useState<number | null>(null);
  const [pendingDeleteUserName, setPendingDeleteUserName] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const query: ManagerUsersListQuery = {
        search,
        role: roleFilter,
        page,
        pageSize,
      };
      const result = await userService.getManagerUsersList(query);
      setRows(result.items);
      setTotal(result.total);
      if (result.page !== page) {
        setPage(result.page);
      }
    } catch {
      appToast.error(MESSAGES.common.somethingWrong);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, roleFilter, search]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const onSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const onRoleFilterChange = (value: RoleFilter) => {
    setRoleFilter(value);
    setPage(1);
  };

  const requestDelete = (userId: number, userName: string) => {
    setPendingDeleteUserId(userId);
    setPendingDeleteUserName(userName);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setPendingDeleteUserId(null);
    setPendingDeleteUserName("");
  };

  const onConfirmDelete = async () => {
    if (pendingDeleteUserId === null) return;
    try {
      await userService.deleteUser(pendingDeleteUserId);
      appToast.success(MESSAGES.user.removed);
      await fetchUsers();
      closeConfirm();
    } catch {
      appToast.error(MESSAGES.common.saveFailed);
    }
  };

  return {
    loading,
    rows,
    total,
    page,
    pageSize,
    search,
    roleFilter,
    onSearchChange,
    onRoleFilterChange,
    onPageChange: setPage,
    requestDelete,
    confirmOpen,
    confirmTitle: "Remove User",
    confirmMessage: pendingDeleteUserName
      ? `Remove "${pendingDeleteUserName}" from users? This cannot be undone.`
      : "Remove this user? This cannot be undone.",
    closeConfirm,
    onConfirmDelete,
  };
}

