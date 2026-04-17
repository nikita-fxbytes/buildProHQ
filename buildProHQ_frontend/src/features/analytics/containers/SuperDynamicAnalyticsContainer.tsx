"use client";

import { useSuperDynamicAnalyticsController } from "@/features/analytics/hooks/useSuperDynamicAnalyticsController";
import { SuperDynamicAnalyticsView } from "@/features/analytics/components/SuperDynamicAnalyticsView";

export function SuperDynamicAnalyticsContainer() {
  const c = useSuperDynamicAnalyticsController();
  return <SuperDynamicAnalyticsView {...c} />;
}

