"use client";

import { useCallback, useEffect, useState } from "react";
import { MESSAGES } from "@/constants/messages";
import { UI_DEFAULTS } from "@/constants/ui";
import { useTableSort } from "@/hooks/use-table-sort";
import { lookupsApi } from "@/services/lookupsApi.service";
import {
  tasksApi,
  type ListCompletedTasksBody,
  type TaskListItem,
} from "@/services/tasksApi.service";
import type { FieldCompletedTaskRow } from "@/types/domain";
import { formatIndianLongDate } from "@/utils/date";
import { appToast } from "@/utils/toast";

type CompletedSortKey = NonNullable<ListCompletedTasksBody["sortBy"]>;

function mapCompletedRow(row: TaskListItem): FieldCompletedTaskRow {
  return {
    id: row.id,
    level: row.level_name ?? "—",
    trade: row.trade_name ?? "—",
    desc: row.description,
    date: formatIndianLongDate(row.closed_at),
    duration: row.days_open ?? 0,
  };
}

export function useUserCompletedController() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<FieldCompletedTaskRow[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = UI_DEFAULTS.COMPLETED_PAGE_SIZE;
  const [showFilters, setShowFilters] = useState(false);
  const [tradeFilters, setTradeFilters] = useState<string[]>([]);
  const [levelFilters, setLevelFilters] = useState<string[]>([]);
  const [tradeOptions, setTradeOptions] = useState<Array<{ value: string; label: string }>>(
    [],
  );
  const [levelOptions, setLevelOptions] = useState<Array<{ value: string; label: string }>>(
    [],
  );

  const { sortKey, sortDirection, toggleSort, setSortKey, setSortDirection } =
    useTableSort<CompletedSortKey>("closedAt", "desc");

  const loadLookups = useCallback(async () => {
    try {
      const [trades, levels] = await Promise.all([lookupsApi.getTrades(), lookupsApi.getLevels()]);
      setTradeOptions(trades.map((t) => ({ value: t.id, label: t.name })));
      setLevelOptions(levels.map((l) => ({ value: l.id, label: l.name })));
    } catch {
      // Non-fatal; filter chips stay empty until retries / navigation.
    }
  }, []);

  const loadTasks = useCallback(
    async (opts?: { pageOverride?: number; searchOverride?: string }) => {
      setLoading(true);
      try {
        const queryPage = opts?.pageOverride ?? page;
        const querySearch = (opts?.searchOverride ?? search).trim() || undefined;
        const body: ListCompletedTasksBody = {
          page: queryPage,
          limit: pageSize,
          search: querySearch,
          sortBy: sortKey ?? undefined,
          sortOrder: sortDirection ?? undefined,
          filters: {
            tradeIds: tradeFilters,
            levelIds: levelFilters,
          },
        };
        const res = await tasksApi.listCompleted(body);
        setRows(res.items.map(mapCompletedRow));
        setTotal(res.meta.total);
      } catch {
        appToast.error(MESSAGES.task.loadFailed);
      } finally {
        setLoading(false);
      }
    },
    [levelFilters, page, search, sortDirection, sortKey, tradeFilters],
  );

  useEffect(() => {
    loadLookups();
  }, [loadLookups]);

  useEffect(() => {
    const t = setTimeout(() => {
      loadTasks({ pageOverride: 1 });
      setPage(1);
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, tradeFilters, levelFilters, sortKey, sortDirection]);

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const toggleFilterValue = (current: string[], value: string) =>
    current.includes(value) ? current.filter((v) => v !== value) : [...current, value];

  const clearFilters = () => {
    setTradeFilters([]);
    setLevelFilters([]);
    setSortKey("closedAt");
    setSortDirection("desc");
  };

  return {
    loading,
    search,
    setSearch: (value: string) => {
      setSearch(value);
      setPage(1);
    },
    page,
    setPage,
    pageSize,
    total,
    rows,
    tradeOptions,
    levelOptions,
    tradeFilters,
    levelFilters,
    setTradeFilters: (value: string) =>
      setTradeFilters((current) => toggleFilterValue(current, value)),
    setLevelFilters: (value: string) =>
      setLevelFilters((current) => toggleFilterValue(current, value)),
    clearFilters,
    sortKey,
    sortDirection,
    showFilters,
    setShowFilters,
    onSortColumn: (key: CompletedSortKey) => {
      toggleSort(key);
      setPage(1);
    },
  };
}
