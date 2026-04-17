"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MESSAGES } from "@/constants/messages";
import { appToast } from "@/utils/toast";
import { getApiErrorMessage } from "@/services/apiError";
import { projectFiltersApi, type ProjectFilterDefinitionRow } from "@/services/projectFiltersApi.service";
import { projectsApi } from "@/services/projectsApi.service";

export type SuperFilterListRow = ProjectFilterDefinitionRow;

export function useSuperFiltersListController() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<SuperFilterListRow[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const projs = await projectsApi.search({ page: 1, limit: 100, sortBy: "createdAt", sortOrder: "desc" });
      const projectIds = projs.items.map((p) => p.id).filter(Boolean);
      const { items, meta } = await projectFiltersApi.search({
        page,
        limit: pageSize,
        search: search.trim() || undefined,
        projectIds,
        sortBy: "createdAt",
        sortOrder: "DESC",
      });
      setRows(items);
      setTotal(meta.total);
    } catch (e) {
      appToast.error(getApiErrorMessage(e, MESSAGES.common.somethingWrong));
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    void load();
  }, [load]);

  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        await projectFiltersApi.remove(id);
        appToast.success(MESSAGES.filter.categoryDeleted);
        await load();
      } catch (e) {
        appToast.error(getApiErrorMessage(e, MESSAGES.common.saveFailed));
      }
    },
    [load],
  );

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize]);

  return {
    loading,
    rows,
    total,
    page: Math.min(page, totalPages),
    pageSize,
    search,
    onSearchChange: (v: string) => {
      setSearch(v);
      setPage(1);
    },
    onPageChange: setPage,
    reload: load,
    deleteCategory,
  };
}
