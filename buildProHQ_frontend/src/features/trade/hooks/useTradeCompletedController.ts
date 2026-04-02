"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MESSAGES } from "@/constants/messages";
import { UI_DEFAULTS } from "@/constants/ui";
import { useAuth } from "@/contexts/AuthContext";
import { tradeCompletedService } from "@/services/tradeCompleted.service";
import type { CompletedTask } from "@/types/domain";
import { appToast } from "@/utils/toast";

const DEFAULT_TRADE = "Painter";

export function useTradeCompletedController() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [allRows, setAllRows] = useState<CompletedTask[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const activeTrade = user?.trade ?? DEFAULT_TRADE;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await tradeCompletedService.getCompletedTasks(activeTrade);
      setAllRows(rows);
    } catch {
      appToast.error(MESSAGES.task.loadFailed);
    } finally {
      setLoading(false);
    }
  }, [activeTrade]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return allRows;
    return allRows.filter(
      (task) =>
        task.level.toLowerCase().includes(term) ||
        task.trade.toLowerCase().includes(term) ||
        task.desc.toLowerCase().includes(term),
    );
  }, [allRows, search]);

  const pageSize = UI_DEFAULTS.COMPLETED_PAGE_SIZE;
  const total = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    setPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const rows = useMemo(
    () => filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filteredRows, safePage, pageSize],
  );

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
    total,
    rows,
  };
}

