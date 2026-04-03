"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MESSAGES } from "@/constants/messages";
import { UI_DEFAULTS } from "@/constants/ui";
import { useTableSort } from "@/hooks/use-table-sort";
import { userTasksService } from "@/services/userTasks.service";
import type { CompletedTask } from "@/types/domain";
import { htmlToPlainText } from "@/utils/richText";
import { appToast } from "@/utils/toast";

type CompletedSortKey = "level" | "trade" | "desc" | "date" | "duration";

export function useUserCompletedController() {
  const [loading, setLoading] = useState(true);
  const [allRows, setAllRows] = useState<CompletedTask[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [tradeFilters, setTradeFilters] = useState<string[]>([]);
  const [levelFilters, setLevelFilters] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<number>(UI_DEFAULTS.COMPLETED_PAGE_SIZE);
  const { sortKey, sortDirection, toggleSort } = useTableSort<CompletedSortKey>();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await userTasksService.getCompletedTasks();
      setAllRows(rows);
    } catch {
      appToast.error(MESSAGES.task.loadFailed);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const tradeOptions = useMemo(
    () => Array.from(new Set(allRows.map((t) => t.trade))).sort(),
    [allRows],
  );
  const levelOptions = useMemo(
    () => Array.from(new Set(allRows.map((t) => t.level))).sort(),
    [allRows],
  );

  const filteredRows = useMemo(() => {
    let rows = allRows;
    const term = search.trim().toLowerCase();
    if (term) {
      rows = rows.filter(
        (task) =>
          task.level.toLowerCase().includes(term) ||
          task.trade.toLowerCase().includes(term) ||
          htmlToPlainText(task.desc).toLowerCase().includes(term),
      );
    }
    if (tradeFilters.length) {
      rows = rows.filter((task) => tradeFilters.includes(task.trade));
    }
    if (levelFilters.length) {
      rows = rows.filter((task) => levelFilters.includes(task.level));
    }
    return rows;
  }, [allRows, search, tradeFilters, levelFilters]);

  const sortedRows = useMemo(() => {
    if (!sortKey) return filteredRows;
    const rows = [...filteredRows];
    const getSortValue = (row: CompletedTask) => {
      if (sortKey === "duration") return row.duration;
      if (sortKey === "date") {
        const [day, month, year] = row.date.split(".").map(Number);
        return new Date((year ?? 0) + 2000, (month ?? 1) - 1, day ?? 1).getTime();
      }
      if (sortKey === "desc") return htmlToPlainText(row.desc).toLowerCase();
      return row[sortKey].toString().toLowerCase();
    };
    rows.sort((a, b) => {
      const left = getSortValue(a);
      const right = getSortValue(b);
      if (left < right) return sortDirection === "asc" ? -1 : 1;
      if (left > right) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [filteredRows, sortKey, sortDirection]);

  const total = sortedRows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const rows = useMemo(
    () => sortedRows.slice((safePage - 1) * pageSize, safePage * pageSize),
    [sortedRows, safePage, pageSize],
  );

  const toggleFilterValue = (current: string[], value: string) =>
    current.includes(value) ? current.filter((v) => v !== value) : [...current, value];

  const clearFilters = () => {
    setTradeFilters([]);
    setLevelFilters([]);
  };

  return {
    loading,
    search,
    setSearch: (value: string) => {
      setSearch(value);
      setPage(1);
    },
    page: safePage,
    setPage,
    pageSize,
    setPageSize: (size: number) => {
      setPageSize(size);
      setPage(1);
    },
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
    onSortColumn: (key: CompletedSortKey) => {
      toggleSort(key);
      setPage(1);
    },
  };
}

