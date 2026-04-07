"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { UI_DEFAULTS } from "@/constants/ui";
import { MESSAGES } from "@/constants/messages";
import { usersApi } from "@/services/usersApi.service";
import type { UserListItem } from "@/services/usersApi.service";
import type { ManagerUsersListItem } from "@/types/domain";
import { appToast } from "@/utils/toast";
import {
  mapListItemToManagerRow,
  matchesManagerUserRoleFilter,
} from "@/features/users/userMappers";

type RoleFilter = "" | "User" | "Trade" | "Management";

export function useManagerUsersListController() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(UI_DEFAULTS.USER_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [rawUsers, setRawUsers] = useState<UserListItem[]>([]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const list = await usersApi.list();
      setRawUsers(list);
    } catch {
      appToast.error(MESSAGES.common.somethingWrong);
      setRawUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rawUsers.filter((u) => {
      if (!matchesManagerUserRoleFilter(u, roleFilter)) return false;
      if (!term) return true;
      const hay = `${u.full_name} ${u.email} ${u.user_type_name} ${u.initials ?? ""}`.toLowerCase();
      return hay.includes(term);
    });
  }, [rawUsers, roleFilter, search]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pages);

  useEffect(() => {
    setPage((p) => Math.min(p, pages));
  }, [pages]);

  const rows: ManagerUsersListItem[] = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filtered.slice(start, start + pageSize).map(mapListItemToManagerRow);
  }, [filtered, pageSize, safePage]);

  const onSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const onRoleFilterChange = (value: RoleFilter) => {
    setRoleFilter(value);
    setPage(1);
  };

  return {
    loading,
    rows,
    total,
    page: safePage,
    pageSize,
    search,
    roleFilter,
    onSearchChange,
    onRoleFilterChange,
    onPageChange: setPage,
    reload: fetchUsers,
  };
}
