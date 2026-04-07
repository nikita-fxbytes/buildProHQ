"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MESSAGES } from "@/constants/messages";
import type { FilterCategoryApi, FilterOptionApi, LookupItem } from "@/services/lookupsApi.service";
import { lookupsApi } from "@/services/lookupsApi.service";
import { appToast } from "@/utils/toast";
import { filtersApi } from "@/services/filtersApi.service";
import { getApiErrorMessage } from "@/services/apiError";

export type ManageFilterCard = {
  id: string;
  name: string;
  subs: Array<{ id: string; name: string }>;
};

export function useManageFiltersController() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<FilterCategoryApi[]>([]);
  const [options, setOptions] = useState<FilterOptionApi[]>([]);
  const [levels, setLevels] = useState<LookupItem[]>([]);
  const [trades, setTrades] = useState<LookupItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [quickSaving, setQuickSaving] = useState<{ level: boolean; trade: boolean }>({
    level: false,
    trade: false,
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [optionsCsv, setOptionsCsv] = useState("");
  const [quickLevel, setQuickLevel] = useState("");
  const [quickTrade, setQuickTrade] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, opts, lv, tr] = await Promise.all([
        lookupsApi.getFilterCategories(),
        lookupsApi.getFilterOptions(),
        lookupsApi.getLevels(),
        lookupsApi.getTrades(),
      ]);
      setCategories(cats);
      setOptions(opts);
      setLevels(lv);
      setTrades(tr);
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
    const byCat = new Map<string, Array<{ id: string; name: string }>>();
    for (const c of categories) {
      byCat.set(c.id, []);
    }
    for (const o of options) {
      const list = byCat.get(o.filterCategoryId);
      if (list) list.push({ id: o.id, name: o.name });
    }
    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      subs: byCat.get(c.id) ?? [],
    }));
  }, [categories, options]);

  return {
    loading,
    saving: saving || quickSaving.level || quickSaving.trade,
    filters,
    levels,
    trades,
    reload: load,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    newCategoryName,
    setNewCategoryName,
    optionsCsv,
    setOptionsCsv,
    quickLevel,
    setQuickLevel,
    quickTrade,
    setQuickTrade,
    setSelectedForAddSubFilter: (categoryId: string) => {
      const cat = categories.find((c) => c.id === categoryId);
      setSelectedCategoryId(categoryId);
      setNewCategoryName(cat?.name ?? "");
    },
    onSaveFilter: async () => {
      try {
        setSaving(true);
        await filtersApi.saveFilter({
          categoryId: selectedCategoryId.trim() || undefined,
          categoryName: selectedCategoryId.trim() ? undefined : newCategoryName.trim() || undefined,
          optionsCsv: optionsCsv,
        });
        appToast.success("Filter saved");
        setOptionsCsv("");
        setNewCategoryName("");
        setSelectedCategoryId("");
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
        appToast.success("Filter deleted");
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
        appToast.success("Sub-filter removed");
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
        await filtersApi.quickAddLevel(quickLevel);
        appToast.success("Level added");
        setQuickLevel("");
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
        await filtersApi.quickAddTrade(quickTrade);
        appToast.success("Trade added");
        setQuickTrade("");
        await load();
      } catch (e) {
        appToast.error(getApiErrorMessage(e, MESSAGES.common.saveFailed));
      } finally {
        setQuickSaving((s) => ({ ...s, trade: false }));
      }
    },
  };
}
