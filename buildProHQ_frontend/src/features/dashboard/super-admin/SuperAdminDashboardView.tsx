"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import { SearchInput } from "@/components/common/SearchInput";
import { AppSelectField } from "@/components/common/AppSelectField";
import { PaginationBar } from "@/components/common/PaginationBar";
import type { UserListItem } from "@/services/usersApi.service";
import type { TaskListItem } from "@/services/tasksApi.service";
import type { SuperDashboardRoleTab } from "./taskUserMatch";
import type { SuperUsersSortKey } from "@/features/dashboard/hooks/useSuperAdminDashboardController";
import { SuperSummaryGrid } from "./components/SuperSummaryGrid";
import { SuperRoleTabs } from "./components/SuperRoleTabs";
import { SuperUserList } from "./components/SuperUserList";
import { SuperUserDetailModal } from "./components/SuperUserDetailModal";

export type SuperAdminDashboardViewProps = {
  initialLoading: boolean;
  summary: {
    openTasks: number;
    completedTasks: number;
    overdueTasks: number;
    totalUsers: number;
  } | null;
  tab: SuperDashboardRoleTab;
  setTab: (tab: SuperDashboardRoleTab) => void;
  roleUsersLoading: boolean;
  roleUsers: UserListItem[];
  roleUsersMeta: { page: number; limit: number; total: number; totalPages: number };
  roleUsersSearch: string;
  setRoleUsersSearch: (value: string) => void;
  roleUsersSort: SuperUsersSortKey;
  setRoleUsersSort: (value: SuperUsersSortKey) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  detailOpen: boolean;
  onCloseDetail: () => void;
  detailUser: UserListItem | null;
  detailLoading: boolean;
  detailProjectsApprox: number | null;
  detailSnapshotTasks: TaskListItem[];
  onUserDetails: (u: UserListItem) => void;
};

const sortOptions: Array<{ value: SuperUsersSortKey; label: string }> = [
  { value: "createdAt_desc", label: "Sort: Newest" },
  { value: "createdAt_asc", label: "Sort: Oldest" },
  { value: "name_asc", label: "Sort: Name (A→Z)" },
  { value: "name_desc", label: "Sort: Name (Z→A)" },
  { value: "email_asc", label: "Sort: Email (A→Z)" },
  { value: "email_desc", label: "Sort: Email (Z→A)" },
  { value: "tasks_desc", label: "Sort: Most tasks" },
  { value: "tasks_asc", label: "Sort: Least tasks" },
  { value: "lastLoginAt_desc", label: "Sort: Last login (recent)" },
  { value: "lastLoginAt_asc", label: "Sort: Last login (oldest)" },
];

export function SuperAdminDashboardView(props: SuperAdminDashboardViewProps) {
  const s = props.summary;
  const showPagination = props.roleUsersMeta.total > props.pageSize;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <SuperSummaryGrid
        initialLoading={props.initialLoading}
        openTasks={s?.openTasks ?? 0}
        completedTasks={s?.completedTasks ?? 0}
        overdueTasks={s?.overdueTasks ?? 0}
        totalUsers={s?.totalUsers ?? 0}
      />

      <Box className="page-header" sx={{ marginTop: "4px !important" }}>
        <Box>
          <Typography
            className="page-heading"
            sx={{ fontSize: 24, fontFamily: STYLE_TOKENS.typography.fontDisplay, fontWeight: 700 }}
          >
            Super Admin Overview
          </Typography>
          <Typography className="page-subtext" sx={{ fontSize: 13, color: STYLE_TOKENS.colors.textMuted }}>
            Complete visibility across field users, trade users, management, tasks, and individual workload
            snapshots.
          </Typography>
        </Box>
      </Box>

      <Paper
        elevation={0}
        className="dashboard-card"
        sx={{
          background: STYLE_TOKENS.colors.card,
          borderRadius: `${STYLE_TOKENS.radius.card}px`,
          boxShadow: STYLE_TOKENS.shadow.card,
          padding: "20px 22px",
        }}
      >
        <Typography
          sx={{
            fontFamily: STYLE_TOKENS.typography.fontDisplay,
            fontSize: 15,
            fontWeight: 700,
            color: STYLE_TOKENS.colors.text,
            marginBottom: "14px",
            paddingBottom: "10px",
            borderBottom: `2px solid ${STYLE_TOKENS.colors.border}`,
            display: "flex",
            alignItems: "center",
            gap: "7px",
          }}
        >
          {props.tab === "Management" && "👥 Managers"}
          {props.tab === "Trade" && "👥 Trade Users"}
          {props.tab === "User" && "👥 Field Users"}
        </Typography>

        <SuperRoleTabs tab={props.tab} onChange={props.setTab} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "14px",
          }}
        >
          <Box sx={{ flex: 1, minWidth: 220 }}>
            <SearchInput
              placeholder="Search users..."
              value={props.roleUsersSearch}
              onChange={(v) => props.setRoleUsersSearch(v)}
            />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: 260 } }}>
            <AppSelectField
              label="Sort By"
              value={props.roleUsersSort}
              onChange={(e) => props.setRoleUsersSort(e.target.value as SuperUsersSortKey)}
              options={sortOptions}
            />
          </Box>
        </Box>

        <SuperUserList
          loading={props.roleUsersLoading}
          tab={props.tab}
          users={props.roleUsers}
          onDetails={props.onUserDetails}
        />

        {showPagination ? (
          <Box sx={{ marginTop: "14px" }}>
            <PaginationBar
              page={props.page}
              pageSize={props.pageSize}
              total={props.roleUsersMeta.total}
              onChange={props.setPage}
            />
          </Box>
        ) : null}
      </Paper>

      <SuperUserDetailModal
        open={props.detailOpen}
        onClose={props.onCloseDetail}
        tab={props.tab}
        user={props.detailUser}
        loading={props.detailLoading}
        projectsApprox={props.detailProjectsApprox}
        snapshotTasks={props.detailSnapshotTasks}
      />
    </Box>
  );
}
