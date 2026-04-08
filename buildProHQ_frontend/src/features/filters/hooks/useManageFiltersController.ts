"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MESSAGES } from "@/constants/messages";
import type { FilterCategoryApi, FilterOptionApi } from "@/services/lookupsApi.service";
import { lookupsApi } from "@/services/lookupsApi.service";
import { appToast } from "@/utils/toast";
import { filtersApi } from "@/services/filtersApi.service";
import { getApiErrorMessage } from "@/services/apiError";

export type ManageFilterCard = {
  filterCategoryId: string;
  filterCategoryName: string;
  subFilters: Array<{ filterOptionId: string; label: string }>;
};

export function useManageFiltersController() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<FilterCategoryApi[]>([]);
  const [options, setOptions] = useState<FilterOptionApi[]>([]);
  const [saving, setSaving] = useState(false);
  const [quickSaving, setQuickSaving] = useState<{ level: boolean; trade: boolean }>({
    level: false,
    trade: false,
  });

  const [selectedFilterCategoryId, setSelectedFilterCategoryId] = useState<string>("");
  const [filterCategoryNameInput, setFilterCategoryNameInput] = useState("");
  const [subFiltersCommaSeparatedInput, setSubFiltersCommaSeparatedInput] = useState("");
  const [quickLevelNameInput, setQuickLevelNameInput] = useState("");
  const [quickTradeNameInput, setQuickTradeNameInput] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, opts] = await Promise.all([
        lookupsApi.getFilterCategories(),
        lookupsApi.getFilterOptions(),
      ]);
      setCategories(cats);
      setOptions(opts);
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
    for (const c of categories) {
      byCat.set(c.id, []);
    }
    for (const o of options) {
      const list = byCat.get(o.filterCategoryId);
      if (list) list.push({ filterOptionId: o.id, label: o.name });
    }
    return categories.map((c) => ({
      filterCategoryId: c.id,
      filterCategoryName: c.name,
      subFilters: byCat.get(c.id) ?? [],
    }));
  }, [categories, options]);

  return {
    loading,
    saving: saving || quickSaving.level || quickSaving.trade,
    filters,
    reload: load,
    categories,
    selectedFilterCategoryId,
    setSelectedFilterCategoryId,
    subFiltersCommaSeparatedInput,
    setSubFiltersCommaSeparatedInput,
    filterCategoryNameInput,
    setFilterCategoryNameInput,
    quickLevelNameInput,
    setQuickLevelNameInput,
    quickTradeNameInput,
    setQuickTradeNameInput,
    setSelectedForAddSubFilter: (categoryId: string) => {
      const cat = categories.find((c) => c.id === categoryId);
      setSelectedFilterCategoryId(categoryId);
      setFilterCategoryNameInput(cat?.name ?? "");
    },
    onSaveFilter: async () => {
      try {
        setSaving(true);
        const subFilterNames = subFiltersCommaSeparatedInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const categoryId = selectedFilterCategoryId.trim();
        await filtersApi.saveFilter({
          filterCategoryId: categoryId || undefined,
          filterCategoryName: categoryId ? undefined : filterCategoryNameInput.trim() || undefined,
          subFilterNames: subFilterNames.length > 0 ? subFilterNames : undefined,
        });
        appToast.success(MESSAGES.filter.saved);
        setSubFiltersCommaSeparatedInput("");
        setFilterCategoryNameInput("");
        setSelectedFilterCategoryId("");
        await load();
      } catch (e) {
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
    onQuickAddLevel: async () => {
      try {
        setQuickSaving((s) => ({ ...s, level: true }));
        await filtersApi.quickAddLevel(quickLevelNameInput);
        appToast.success(MESSAGES.filter.levelAdded);
        setQuickLevelNameInput("");
        await load();
      } catch (e) {
        appToast.error(getApiErrorMessage(e, MESSAGES.common.saveFailed));
      } finally {
        setQuickSaving((s) => ({ ...s, level: false }));
      }
    },
    onQuickAddTrade: async () => {
      try {
        setQuickSaving((s) => ({ ...s, trade: true }));
        await filtersApi.quickAddTrade(quickTradeNameInput);
        appToast.success(MESSAGES.filter.tradeAdded);
        setQuickTradeNameInput("");
        await load();
      } catch (e) {
        appToast.error(getApiErrorMessage(e, MESSAGES.common.saveFailed));
      } finally {
        setQuickSaving((s) => ({ ...s, trade: false }));
      }
    },
  };
}
