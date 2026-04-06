"use client";

import { ManagerAnalyticsView } from "@/components/analytics/ManagerAnalyticsView";
import { useManagerAnalyticsController } from "@/features/analytics/hooks/useManagerAnalyticsController";

export function ManagerAnalyticsContainer() {
  const controller = useManagerAnalyticsController();
  return <ManagerAnalyticsView {...controller} />;
}

