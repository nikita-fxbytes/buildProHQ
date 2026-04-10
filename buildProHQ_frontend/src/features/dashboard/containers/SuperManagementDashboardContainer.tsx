"use client";

import { useManagerAnalyticsController } from "@/features/analytics/hooks/useManagerAnalyticsController";
import { ManagerAnalyticsView } from "@/components/analytics/ManagerAnalyticsView";
import { SuperManagementDashboardHeader } from "@/components/dashboard/SuperManagementDashboardHeader";

export function SuperManagementDashboardContainer() {
  const c = useManagerAnalyticsController();
  return (
    <>
      <SuperManagementDashboardHeader />
      <ManagerAnalyticsView loading={c.loading} data={c.data} reload={c.reload} />
    </>
  );
}

