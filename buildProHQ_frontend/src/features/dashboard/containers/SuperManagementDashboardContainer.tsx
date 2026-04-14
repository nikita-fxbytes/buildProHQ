"use client";

import { useSuperManagementDashboardController } from "@/features/dashboard/hooks/useSuperManagementDashboardController";
import { SuperManagementDashboardView } from "@/features/dashboard/super-management/SuperManagementDashboardView";

export function SuperManagementDashboardContainer() {
  const c = useSuperManagementDashboardController();
  return (
    <SuperManagementDashboardView
      loading={c.loading}
      stats={c.stats}
      analytics={c.analytics}
      recentLoading={c.recentLoading}
      recentTasks={c.recentTasks}
      exportLoading={c.exportLoading}
      onExportCSV={c.exportCSV}
      onBuildPrintableReport={c.buildPrintableReport}
    />
  );
}

