"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { lookupsApi, type FilterCategoryApi, type FilterOptionApi } from "@/services/lookupsApi.service";
import { projectsApi, type ProjectListItem } from "@/services/projectsApi.service";
import { MESSAGES } from "@/constants/messages";
import { appToast } from "@/utils/toast";
import { getApiErrorMessage } from "@/services/apiError";
import { filtersApi } from "@/services/filtersApi.service";

export type SuperFilterListRow = {
  id: string;
  projectId: string | null;
  projectName: string;
  categoryName: string;
  subFiltersCount: number;
  subFiltersPreview: string;
};

type SortKey = "project" | "category" | "subFilters";

export function useSuperFiltersListController() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<FilterCategoryApi[]>([]);
  const [options, setOptions] = useState<FilterOptionApi[]>([]);
  const [projects, setProjects] = useState<ProjectListItem[]>([]);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("project");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, opts, projs] = await Promise.all([
        lookupsApi.getFilterCategories(),
        lookupsApi.getFilterOptions(),
        projectsApi.search({ page: 1, limit: 100 }),
      ]);
      setCategories(cats);
      setOptions(opts);
      setProjects(projs.items);
    } catch (e) {
      appToast.error(getApiErrorMessage(e, MESSAGES.common.somethingWrong));
      setCategories([]);
      setOptions([]);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const projectNameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of projects) m.set(p.id, p.name);
    return m;
  }, [projects]);

  const rows = useMemo<SuperFilterListRow[]>(() => {
    const optsByCat = new Map<string, string[]>();
    for (const o of options) {
      const arr = optsByCat.get(o.filterCategoryId) ?? [];
      arr.push(o.name);
      optsByCat.set(o.filterCategoryId, arr);
    }
    return categories.map((c) => {
      const list = optsByCat.get(c.id) ?? [];
      const preview = list.slice(0, 6).join(", ");
      const projectId = c.projectId ?? null;
      return {
        id: c.id,
        projectId,
        projectName: projectId ? projectNameById.get(projectId) ?? "—" : "Global",
        categoryName: c.name,
        subFiltersCount: list.length,
        subFiltersPreview: list.length > 6 ? `${preview} …` : preview || "—",
      };
    });
  }, [categories, options, projectNameById]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) => {
      if (r.projectName.toLowerCase().includes(term)) return true;
      if (r.categoryName.toLowerCase().includes(term)) return true;
      return r.subFiltersPreview.toLowerCase().includes(term);
    });
  }, [rows, search]);

  const sorted = useMemo(() => {
    const dir = sortDirection === "asc" ? 1 : -1;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const by =
        sortKey === "category"
          ? a.categoryName.localeCompare(b.categoryName)
          : sortKey === "subFilters"
            ? a.subFiltersCount - b.subFiltersCount
            : a.projectName.localeCompare(b.projectName);
      if (by !== 0) return by * dir;
      return a.categoryName.localeCompare(b.categoryName);
    });
    return copy;
  }, [filtered, sortDirection, sortKey]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const items = sorted.slice((pageSafe - 1) * pageSize, pageSafe * pageSize);

  const deleteCategory = useCallback(
    async (id: string) => {
      try {
        await filtersApi.deleteCategory(id);
        appToast.success(MESSAGES.filter.categoryDeleted);
        await load();
      } catch (e) {
        appToast.error(getApiErrorMessage(e, MESSAGES.common.saveFailed));
      }
    },
    [load],
  );

  return {
    loading,
    rows: items,
    total,
    page: pageSafe,
    pageSize,
    search,
    sortKey,
    sortDirection,
    onSearchChange: (v: string) => {
      setSearch(v);
      setPage(1);
    },
    onSortColumn: (key: SortKey) => {
      if (sortKey === key) {
        setSortDirection((p) => (p === "asc" ? "desc" : "asc"));
      } else {
        setSortKey(key);
        setSortDirection("asc");
      }
      setPage(1);
    },
    onPageChange: setPage,
    reload: load,
    deleteCategory,
  };
}

