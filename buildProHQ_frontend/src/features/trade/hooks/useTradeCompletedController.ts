"use client";

import { useCallback, useEffect, useState } from "react";
import { MESSAGES } from "@/constants/messages";
import { UI_DEFAULTS } from "@/constants/ui";
import { mapCompletedToTradePortal } from "@/features/trade/tradeTaskMappers";
import { tasksApi } from "@/services/tasksApi.service";
import type { TradePortalCompletedTask } from "@/types/domain";
import { appToast } from "@/utils/toast";

export function useTradeCompletedController() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<TradePortalCompletedTask[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const pageSize = UI_DEFAULTS.COMPLETED_PAGE_SIZE;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tasksApi.listCompleted({
        page,
        limit: pageSize,
        search: search.trim() || undefined,
        sortBy: "date",
        sortOrder: "desc",
      });
      setRows(res.items.map(mapCompletedToTradePortal));
      setTotal(res.meta.total);
    } catch {
      appToast.error(MESSAGES.task.loadFailed);
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    void load();
  }, [load]);

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
  };
}
