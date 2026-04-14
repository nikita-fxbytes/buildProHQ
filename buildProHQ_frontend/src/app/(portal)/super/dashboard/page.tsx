"use client";

import { SuperAdminDashboardView } from "@/features/dashboard/super-admin/SuperAdminDashboardView";
import { useSuperAdminDashboardController } from "@/features/dashboard/hooks/useSuperAdminDashboardController";

export default function SuperDashboardPage() {
  const c = useSuperAdminDashboardController();
  return (
    <SuperAdminDashboardView
      initialLoading={c.initialLoading}
      summary={c.summary}
      tab={c.tab}
      setTab={c.setTab}
      roleUsersLoading={c.roleUsersLoading}
      roleUsers={c.roleUsers}
      roleUsersMeta={c.roleUsersMeta}
      roleUsersSearch={c.roleUsersSearch}
      setRoleUsersSearch={c.setRoleUsersSearch}
      roleUsersSort={c.roleUsersSort}
      setRoleUsersSort={c.setRoleUsersSort}
      page={c.page}
      setPage={c.setPage}
      pageSize={c.pageSize}
      detailOpen={c.detailOpen}
      onCloseDetail={c.closeUserDetails}
      detailUser={c.detailUser}
      detailLoading={c.detailLoading}
      detailProjectsApprox={c.detailProjectsApprox}
      detailSnapshotTasks={c.detailSnapshotTasks}
      onUserDetails={c.openUserDetails}
    />
  );
}
