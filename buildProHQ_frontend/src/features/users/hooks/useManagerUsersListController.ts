"use client";

import { useCallback, useEffect, useState } from "react";
import { UI_DEFAULTS } from "@/constants/ui";
import { MESSAGES } from "@/constants/messages";
import { useTableSort } from "@/hooks/use-table-sort";
import { usersApi, type SearchUsersBody } from "@/services/usersApi.service";
import type { ManagerUsersListItem } from "@/types/domain";
import { appToast } from "@/utils/toast";
import { mapListItemToManagerRow } from "@/features/users/userMappers";

type RoleFilter = "" | "User" | "Trade" | "Management";
type SortKey = NonNullable<SearchUsersBody["sortBy"]>;

export function useManagerUsersListController() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<ManagerUsersListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("");
  const [page, setPage] = useState(1);
  const pageSize = UI_DEFAULTS.USER_PAGE_SIZE;

  const { sortKey, sortDirection, toggleSort } = useTableSort<SortKey>(
    "createdAt",
    "desc",
  );

  const loadUsers = useCallback(
    async (opts?: { pageOverride?: number }) => {
      setLoading(true);
      try {
        const queryPage = opts?.pageOverride ?? page;
        const query: SearchUsersBody = {
          page: queryPage,
          limit: pageSize,
          search: search.trim() || undefined,
          role: roleFilter || undefined,
          sortBy: sortKey ?? undefined,
          sortOrder: sortDirection ?? undefined,
        };
        const res = await usersApi.search(query);
        setRows(res.items.map(mapListItemToManagerRow));
        setTotal(res.meta.total);
      } catch {
        appToast.error(MESSAGES.common.somethingWrong);
        setRows([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize, roleFilter, search, sortDirection, sortKey],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      loadUsers({ pageOverride: 1 });
      setPage(1);
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, roleFilter, sortKey, sortDirection, pageSize]);

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const onSearchChange = (value: string) => {
    setSearch(value);
  };

  const onRoleFilterChange = (value: RoleFilter) => {
    setRoleFilter(value);
  };

  const removeUser = useCallback(
    async (id: string) => {
      try {
        await usersApi.remove(id);
        appToast.success(MESSAGES.user.removed);
        await loadUsers();
      } catch {
        appToast.error(MESSAGES.common.saveFailed);
      }
    },
    [loadUsers],
  );

  return {
    loading,
    rows,
    total,
    page,
    pageSize,
    search,
    roleFilter,
    sortKey,
    sortDirection,
    onSortColumn: (key: SortKey) => {
      toggleSort(key);
      setPage(1);
    },
    onSearchChange,
    onRoleFilterChange,
    onPageChange: setPage,
    reload: loadUsers,
    removeUser,
  };
}
