"use client";

import { useCallback, useEffect, useState } from "react";
import { MESSAGES } from "@/constants/messages";
import { tasksApi, type ManagerAnalytics } from "@/services/tasksApi.service";
import { appToast } from "@/utils/toast";

export function useManagerAnalyticsController() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ManagerAnalytics | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tasksApi.getAnalytics();
      setData(res);
    } catch {
      appToast.error(MESSAGES.common.somethingWrong);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { loading, data, reload: load };
}

