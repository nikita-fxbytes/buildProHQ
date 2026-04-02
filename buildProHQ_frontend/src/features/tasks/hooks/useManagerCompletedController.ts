"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MESSAGES } from "@/constants/messages";
import { UI_DEFAULTS } from "@/constants/ui";
import { taskService } from "@/services/task.service";
import type { CompletedTask } from "@/types/domain";
import { appToast } from "@/utils/toast";

type ManagerCompletedRow = CompletedTask & {
  userLabel: string;
  durationLabel: string;
};

const toggleFilterValue = (values: string[], value: string) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

export function useManagerCompletedController() {
  const [loading, setLoading] = useState(true);
  const [allRows, setAllRows] = useState<CompletedTask[]>([]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [tradeFilters, setTradeFilters] = useState<string[]>([]);
  const [levelFilters, setLevelFilters] = useState<string[]>([]);
  const [userFilters, setUserFilters] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(UI_DEFAULTS.COMPLETED_PAGE_SIZE);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await taskService.getManagerCompletedTasks();
      setAllRows(rows);
    } catch {
      appToast.error(MESSAGES.task.loadFailed);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const tradeOptions = useMemo(
    () => Array.from(new Set(allRows.map((task) => task.trade))),
    [allRows],
  );
  const levelOptions = useMemo(
    () => Array.from(new Set(allRows.map((task) => task.level))).sort(),
    [allRows],
  );
  const userOptions = useMemo(
    () => Array.from(new Set(allRows.map((task) => task.user))).filter(Boolean),
    [allRows],
  );

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return allRows.filter((task) => {
      if (
        query &&
        !`${task.level} ${task.trade} ${task.desc} ${task.user}`.toLowerCase().includes(query)
      ) {
        return false;
      }
      if (tradeFilters.length && !tradeFilters.includes(task.trade)) return false;
      if (levelFilters.length && !levelFilters.includes(task.level)) return false;
      if (userFilters.length && !userFilters.includes(task.user)) return false;
      return true;
    });
  }, [allRows, search, tradeFilters, levelFilters, userFilters]);

  const total = filteredRows.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(page, 1), pages);

  useEffect(() => {
    setPage((current) => Math.min(current, pages));
  }, [pages]);

  const rows = useMemo<ManagerCompletedRow[]>(
    () =>
      filteredRows
        .slice((safePage - 1) * pageSize, safePage * pageSize)
        .map((task) => ({
          ...task,
          userLabel: task.user || "–",
          durationLabel: `${task.duration}d`,
        })),
    [filteredRows, pageSize, safePage],
  );

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
    page: safePage,
    setPage,
    pageSize,
    setPageSize: (value: number) => {
      setPageSize(value);
      setPage(1);
    },
    total,
    rows,
  };
}

