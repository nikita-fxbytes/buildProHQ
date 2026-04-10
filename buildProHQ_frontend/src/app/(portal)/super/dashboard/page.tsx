"use client";

import { SuperAdminDashboardView } from "@/components/dashboard/SuperAdminDashboardView";
import { useSuperAdminDashboardController } from "@/features/dashboard/hooks/useSuperAdminDashboardController";

export default function SuperDashboardPage() {
  const c = useSuperAdminDashboardController();
  return (
    <SuperAdminDashboardView
      loading={c.loading}
      initialLoading={c.initialLoading}
      summary={c.summary}
      tab={c.tab}
      setTab={c.setTab}
      roleUsersLoading={c.roleUsersLoading}
      roleUsers={c.roleUsers}
    />
  );
}

