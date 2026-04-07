"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MESSAGES } from "@/constants/messages";
import type { FilterCategoryApi, FilterOptionApi, LookupItem } from "@/services/lookupsApi.service";
import { lookupsApi } from "@/services/lookupsApi.service";
import type { FilterCategory } from "@/types/domain";
import { appToast } from "@/utils/toast";

export function useManageFiltersController() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<FilterCategoryApi[]>([]);
  const [options, setOptions] = useState<FilterOptionApi[]>([]);
  const [levels, setLevels] = useState<LookupItem[]>([]);
  const [trades, setTrades] = useState<LookupItem[]>([]);

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

  const filters: FilterCategory[] = useMemo(() => {
    const byCat = new Map<string, string[]>();
    for (const c of categories) {
      byCat.set(c.id, []);
    }
    for (const o of options) {
      const list = byCat.get(o.filterCategoryId);
      if (list) list.push(o.name);
    }
    return categories.map((c) => ({
      name: c.name,
      subs: byCat.get(c.id) ?? [],
    }));
  }, [categories, options]);

  return {
    loading,
    filters,
    levels,
    trades,
    reload: load,
  };
}
