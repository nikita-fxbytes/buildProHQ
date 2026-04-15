"use client";

import { useCallback, useEffect, useState } from "react";
import { MESSAGES } from "@/constants/messages";
import { UI_DEFAULTS } from "@/constants/ui";
import { useTableSort } from "@/hooks/use-table-sort";
import { lookupsApi } from "@/services/lookupsApi.service";
import { tasksApi, type CompletedTaskListItem, type ListCompletedTasksBody } from "@/services/tasksApi.service";
import { usersApi } from "@/services/usersApi.service";
import { appToast } from "@/utils/toast";
import { formatDate } from "@/utils/date";

type SortKey = "level" | "trade" | "user" | "description" | "date" | "duration";

const toggleFilterValue = (values: string[], value: string) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

function mapRow(task: CompletedTaskListItem) {
  const initials =
    task.completed_by_initials ??
    task.completed_by_full_name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") ??
    null;
  return {
    id: task.id,
    level: task.level_name ?? "–",
    trade: task.trade_name ?? "–",
    user: initials ?? "–",
    desc: task.description,
    date: formatDate(task.closed_at),
    durationDays: task.days_open,
  };
}

export function useManagerCompletedController() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Array<ReturnType<typeof mapRow>>>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [tradeFilters, setTradeFilters] = useState<string[]>([]);
  const [levelFilters, setLevelFilters] = useState<string[]>([]);
  const [userFilters, setUserFilters] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = UI_DEFAULTS.COMPLETED_PAGE_SIZE;

  const { sortKey, sortDirection, toggleSort } = useTableSort<SortKey>("date");

  const [tradeOptions, setTradeOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [levelOptions, setLevelOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [userOptions, setUserOptions] = useState<Array<{ value: string; label: string }>>([]);

  const loadLookups = useCallback(async () => {
    try {
      const [trades, levels, users] = await Promise.all([
        lookupsApi.getTrades(),
        lookupsApi.getLevels(),
        usersApi.list(),
      ]);
      setTradeOptions(trades.map((t) => ({ value: t.id, label: t.name })));
      setLevelOptions(levels.map((l) => ({ value: l.id, label: l.name })));
      setUserOptions(
        users
          .filter((u) => Boolean(u.initials))
          .map((u) => ({ value: u.id, label: u.initials as string })),
      );
    } catch {
      // Non-fatal; page can still load data.
    }
  }, []);

  const loadCompleted = useCallback(
    async (opts?: { pageOverride?: number }) => {
      setLoading(true);
      try {
        const queryPage = opts?.pageOverride ?? page;
        const query: ListCompletedTasksBody = {
          page: queryPage,
          limit: pageSize,
          search: search.trim() || undefined,
          sortBy: sortKey ?? undefined,
          sortOrder: sortDirection ?? undefined,
          filters: {
            tradeIds: tradeFilters,
            levelIds: levelFilters,
            completedByUserIds: userFilters,
          } satisfies NonNullable<ListCompletedTasksBody["filters"]>,
        };
        const res = await tasksApi.listCompleted(query);
        setRows(res.items.map(mapRow));
        setTotal(res.meta.total);
      } catch {
        appToast.error(MESSAGES.task.loadFailed);
      } finally {
        setLoading(false);
      }
    },
    [levelFilters, page, pageSize, search, sortDirection, sortKey, tradeFilters, userFilters],
  );

  useEffect(() => {
    loadLookups();
  }, [loadLookups]);

  useEffect(() => {
    void loadCompleted({ pageOverride: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, tradeFilters, levelFilters, userFilters, sortKey, sortDirection, pageSize]);

  useEffect(() => {
    void loadCompleted();
  }, [loadCompleted, page]);

  return {
    loading,
    search,
    setSearch: (value: string) => {
      setSearch(value);
      setPage(1);
    },
    showFilters,
    setShowFilters,
    tradeOptions,
    levelOptions,
    userOptions,
    tradeFilters,
    levelFilters,
    userFilters,
    setTradeFiltersDirect: setTradeFilters,
    setLevelFiltersDirect: setLevelFilters,
    setUserFiltersDirect: setUserFilters,
    setTradeFilters: (value: string) => {
      setTradeFilters((current) => toggleFilterValue(current, value));
      setPage(1);
    },
    setLevelFilters: (value: string) => {
      setLevelFilters((current) => toggleFilterValue(current, value));
      setPage(1);
    },
    setUserFilters: (value: string) => {
      setUserFilters((current) => toggleFilterValue(current, value));
      setPage(1);
    },
    clearFilters: () => {
      setTradeFilters([]);
      setLevelFilters([]);
      setUserFilters([]);
      setPage(1);
    },
    page,
    setPage: (p: number) => setPage(p),
    pageSize,
    total,
    rows,
    sortKey,
    sortDirection,
    onSortColumn: (key: SortKey) => {
      toggleSort(key);
      setPage(1);
    },
  };
}

