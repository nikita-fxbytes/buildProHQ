"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { analyticsApi, type TasksAnalyticsResponse } from "@/services/analyticsApi.service";
import { projectsApi } from "@/services/projectsApi.service";
import { getApiErrorMessage } from "@/services/apiError";
import { appToast } from "@/utils/toast";
import { MESSAGES } from "@/constants/messages";

export function useSuperDynamicAnalyticsController() {
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectOptions, setProjectOptions] = useState<Array<{ value: string; label: string }>>([]);
  const [projectId, setProjectId] = useState<string>("");
  const [data, setData] = useState<TasksAnalyticsResponse | null>(null);

  const loadProjects = useCallback(async () => {
    setProjectsLoading(true);
    try {
      const res = await projectsApi.search({ page: 1, limit: 200, sortBy: "createdAt", sortOrder: "desc" });
      const opts = res.items.map((p) => ({ value: p.id, label: p.name }));
      setProjectOptions(opts);
    } catch (e) {
      setProjectOptions([]);
      appToast.error(getApiErrorMessage(e, MESSAGES.common.somethingWrong));
    } finally {
      setProjectsLoading(false);
    }
  }, [projectId]);

  const load = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      setData(null);
      return;
    }
    setLoading(true);
    try {
      const res = await analyticsApi.tasks({ projectId });
      setData(res);
    } catch (e) {
      setData(null);
      appToast.error(getApiErrorMessage(e, MESSAGES.common.somethingWrong));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Fetch only when project changes (and once initial project is chosen).
    void load();
  }, [load]);

  const projectCards = useMemo(() => data ?? null, [data]);
  const filterCharts = useMemo(() => (Array.isArray(data?.filters) ? data!.filters : []), [data]);

  return {
    loading,
    projectsLoading,
    projectId,
    setProjectId,
    projectOptions,
    cards: projectCards,
    filters: filterCharts,
    reload: load,
  };
}

