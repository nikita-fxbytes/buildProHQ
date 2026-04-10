"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MESSAGES } from "@/constants/messages";
import type { FilterCategoryApi, FilterOptionApi } from "@/services/lookupsApi.service";
import { lookupsApi } from "@/services/lookupsApi.service";
import { appToast } from "@/utils/toast";
import { filtersApi } from "@/services/filtersApi.service";
import { getApiErrorMessage, normalizeApiError } from "@/services/apiError";
import { projectsApi, type MyProjectItem } from "@/services/projectsApi.service";

export type ManageFilterCard = {
  filterCategoryId: string;
  filterCategoryName: string;
  subFilters: Array<{ filterOptionId: string; label: string }>;
};

export type ManageFilterFieldErrors = {
  category?: string;
  subFilters?: string;
};

function dedupeSubFilterNamesFromCsv(input: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of input.split(",")) {
    const t = raw.trim();
    if (!t) continue;
    const k = t.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(t);
  }
  return out.slice(0, 100);
}

function mapFilterValidationDetailsToFields(details: string[]): ManageFilterFieldErrors {
  const out: ManageFilterFieldErrors = {};
  for (const raw of details) {
    const d = raw.trim();
    if (!d) continue;
    const lower = d.toLowerCase();
    const isSub =
      lower.includes("sub-filter") ||
      lower.includes("subfilter") ||
      lower.includes("100 sub-filter") ||
      /\b100\b.*sub/.test(lower);
    if (isSub) {
      out.subFilters = d;
      continue;
    }
    if (lower.includes("category") || lower.includes("filter category")) {
      out.category = d;
    }
  }
  return out;
}

export function useManageFiltersController() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<FilterCategoryApi[]>([]);
  const [options, setOptions] = useState<FilterOptionApi[]>([]);
  const [projects, setProjects] = useState<MyProjectItem[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const [selectedFilterCategoryId, _setSelectedFilterCategoryId] = useState<string>("");
  const [filterCategoryNameInput, _setFilterCategoryNameInput] = useState("");
  const [subFiltersCommaSeparatedInput, _setSubFiltersCommaSeparatedInput] = useState("");
  const [filterFieldErrors, setFilterFieldErrors] = useState<ManageFilterFieldErrors>({});

  const setSelectedFilterCategoryId = useCallback((id: string) => {
    _setSelectedFilterCategoryId(id);
    setFilterFieldErrors((prev) => (prev.category ? { ...prev, category: undefined } : prev));
  }, []);

  const setFilterCategoryNameInput = useCallback((v: string) => {
    _setFilterCategoryNameInput(v);
    setFilterFieldErrors((prev) => (prev.category ? { ...prev, category: undefined } : prev));
  }, []);

  const setSubFiltersCommaSeparatedInput = useCallback((v: string) => {
    _setSubFiltersCommaSeparatedInput(v);
    setFilterFieldErrors((prev) => (prev.subFilters ? { ...prev, subFilters: undefined } : prev));
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, opts, myProjects] = await Promise.all([
        lookupsApi.getFilterCategories(),
        lookupsApi.getFilterOptions(),
        projectsApi.listMine(),
      ]);
      setCategories(cats);
      setOptions(opts);
      setProjects(myProjects);
      setSelectedProjectId((prev) => {
        if (prev && myProjects.some((p) => p.id === prev)) return prev;
        return myProjects[0]?.id ?? "";
      });
    } catch {
      appToast.error(MESSAGES.common.somethingWrong);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filters: ManageFilterCard[] = useMemo(() => {
    const byCat = new Map<string, Array<{ filterOptionId: string; label: string }>>();
    const visibleCategories = categories.filter((c) => {
      const pid = c.projectId ?? null;
      if (!selectedProjectId) return pid === null;
      return pid === null || pid === selectedProjectId;
    });
    for (const c of visibleCategories) {
      byCat.set(c.id, []);
    }
    for (const o of options) {
      const list = byCat.get(o.filterCategoryId);
      if (list) list.push({ filterOptionId: o.id, label: o.name });
    }
    return visibleCategories.map((c) => ({
      filterCategoryId: c.id,
      filterCategoryName: c.name,
      subFilters: byCat.get(c.id) ?? [],
    }));
  }, [categories, options, selectedProjectId]);

  return {
    loading,
    saving,
    filters,
    reload: load,
    projects,
    selectedProjectId,
    setSelectedProjectId,
    categories: categories
      .filter((c) => {
        const pid = c.projectId ?? null;
        if (!selectedProjectId) return pid === null;
        return pid === null || pid === selectedProjectId;
      })
      .map((c) => ({ id: c.id, name: c.name })),
    selectedFilterCategoryId,
    setSelectedFilterCategoryId,
    subFiltersCommaSeparatedInput,
    setSubFiltersCommaSeparatedInput,
    filterCategoryNameInput,
    setFilterCategoryNameInput,
    setSelectedForAddSubFilter: (categoryId: string) => {
      const cat = categories.find((c) => c.id === categoryId);
      setSelectedFilterCategoryId(categoryId);
      setFilterCategoryNameInput(cat?.name ?? "");
      setSubFiltersCommaSeparatedInput("");
      setFilterFieldErrors({});
    },
    filterFieldErrors,
    onSaveFilter: async () => {
      const subFilterNames = dedupeSubFilterNamesFromCsv(subFiltersCommaSeparatedInput);
      const categoryId = selectedFilterCategoryId.trim();
      const name = filterCategoryNameInput.trim();

      const nextErrors: ManageFilterFieldErrors = {};
      if (!categoryId) {
        if (!selectedProjectId) {
          nextErrors.category = MESSAGES.validation.selectProject;
        }
        if (name.length > 0 && name.length < 2) {
          nextErrors.category = MESSAGES.filter.validation.categoryMinLength;
        }
        if (name.length > 100) {
          nextErrors.category = MESSAGES.filter.validation.categoryMaxLength;
        }
      }
      if (subFilterNames.length > 100) {
        nextErrors.subFilters = MESSAGES.filter.validation.subFiltersMaxCount;
      }
      for (const s of subFilterNames) {
        if (s.length > 100) {
          nextErrors.subFilters = MESSAGES.filter.validation.subFilterMaxLength;
          break;
        }
      }
      if (Object.keys(nextErrors).length > 0) {
        setFilterFieldErrors((prev) => ({ ...prev, ...nextErrors }));
        return;
      }

      setFilterFieldErrors({});

      try {
        setSaving(true);
        await filtersApi.saveFilter({
          filterCategoryId: categoryId || undefined,
          filterCategoryName: categoryId ? undefined : name || undefined,
          subFilterNames: subFilterNames.length > 0 ? subFilterNames : undefined,
          projectIds: categoryId ? undefined : selectedProjectId ? [selectedProjectId] : undefined,
        });
        appToast.success(MESSAGES.filter.saved);
        setFilterFieldErrors({});
        setSubFiltersCommaSeparatedInput("");
        setFilterCategoryNameInput("");
        setSelectedFilterCategoryId("");
        await load();
      } catch (e) {
        const normalized = normalizeApiError(e, MESSAGES.common.saveFailed);
        const details = normalized.details ?? [];
        if (details.length > 0) {
          const mapped = mapFilterValidationDetailsToFields(details);
          setFilterFieldErrors((prev) => ({ ...prev, ...mapped }));
        }
        appToast.error(getApiErrorMessage(e, MESSAGES.common.saveFailed));
      } finally {
        setSaving(false);
      }
    },
    onDeleteCategory: async (id: string) => {
      try {
        setSaving(true);
        await filtersApi.deleteCategory(id);
        appToast.success(MESSAGES.filter.categoryDeleted);
        await load();
      } catch (e) {
        appToast.error(getApiErrorMessage(e, MESSAGES.common.saveFailed));
      } finally {
        setSaving(false);
      }
    },
    onDeleteOption: async (id: string) => {
      try {
        setSaving(true);
        await filtersApi.deleteOption(id);
        appToast.success(MESSAGES.filter.subFilterRemoved);
        await load();
      } catch (e) {
        appToast.error(getApiErrorMessage(e, MESSAGES.common.saveFailed));
      } finally {
        setSaving(false);
      }
    },
  };
}
