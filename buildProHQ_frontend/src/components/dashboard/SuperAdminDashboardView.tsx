"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { StatCard } from "@/components/common/StatCard";
import { AppButton } from "@/components/common/AppButton";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import type { UserListItem } from "@/services/usersApi.service";

type RoleTab = "Management" | "Trade" | "User";

export type SuperAdminDashboardViewProps = {
  loading: boolean;
  initialLoading: boolean;
  summary: {
    openTasks: number;
    completedTasks: number;
    overdueTasks: number;
    totalUsers: number;
  } | null;
  tab: RoleTab;
  setTab: (tab: RoleTab) => void;
  roleUsersLoading: boolean;
  roleUsers: UserListItem[];
};

function statPill(label: string, value: number, tone: "open" | "done" | "overdue") {
  const styles =
    tone === "open"
      ? { bg: "#FFF3D4", color: "#E09010" }
      : tone === "done"
        ? { bg: "#DCFCE7", color: "#16A34A" }
        : { bg: "#FEE2E2", color: "#EF4444" };
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        borderRadius: "999px",
        background: styles.bg,
        color: styles.color,
        fontSize: 12,
        fontWeight: 800,
        lineHeight: 1,
        border: `1px solid ${STYLE_TOKENS.colors.border}`,
      }}
    >
      <span style={{ fontWeight: 900 }}>{value}</span>
      <span style={{ fontWeight: 800 }}>{label}</span>
    </Box>
  );
}

function UserRow({ u, onDetails }: { u: UserListItem; onDetails: (u: UserListItem) => void }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "34px 1fr auto 92px",
        columnGap: "14px",
        alignItems: "center",
        border: `1px solid ${STYLE_TOKENS.colors.border}`,
        borderRadius: "12px",
        padding: "12px 14px",
        background: "#fff",
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: STYLE_TOKENS.colors.orange,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: STYLE_TOKENS.typography.fontDisplay,
          fontWeight: 800,
          fontSize: 13,
        }}
      >
        {(u.initials || "?").toUpperCase()}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 900, color: STYLE_TOKENS.colors.text, lineHeight: 1.2 }}>
          {u.full_name}
        </Typography>
        <Typography
          sx={{
            fontSize: 12.5,
            color: STYLE_TOKENS.colors.textMuted,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {u.email}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
        {statPill("Open", u.open_tasks_count ?? 0, "open")}
        {statPill("Completed", u.completed_tasks_count ?? 0, "done")}
        {statPill("Overdue", u.overdue_tasks_count ?? 0, "overdue")}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <AppButton variant="outlined" size="small" onClick={() => onDetails(u)} sx={{ minWidth: 80 }}>
          Details
        </AppButton>
      </Box>
    </Box>
  );
}

export function SuperAdminDashboardView(props: SuperAdminDashboardViewProps) {
  const s = props.summary;
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<UserListItem | null>(null);

  return (
    <Stack spacing={2}>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
        {props.initialLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Paper key={idx} elevation={0} className="table-card" sx={{ p: 2 }}>
              <Skeleton variant="text" width={90} height={34} />
              <Skeleton variant="text" width={140} />
            </Paper>
          ))
        ) : (
          <>
            <StatCard value={s?.openTasks ?? 0} label="All Open Tasks" accentColor="#F5A623" />
            <StatCard value={s?.completedTasks ?? 0} label="All Completed" accentColor="#22C55E" />
            <StatCard value={s?.overdueTasks ?? 0} label="Overdue Tasks" accentColor="#EF4444" />
            <StatCard value={s?.totalUsers ?? 0} label="Total Users" accentColor="#3BB0D8" />
          </>
        )}
      </Box>

      <Box className="page-header" sx={{ marginTop: "4px !important" }}>
        <Box>
          <Typography
            className="page-heading"
            sx={{ fontSize: 24, fontFamily: STYLE_TOKENS.typography.fontDisplay, fontWeight: 800 }}
          >
            Super Admin Overview
          </Typography>
          <Typography className="page-subtext" sx={{ fontSize: 13, color: STYLE_TOKENS.colors.textMuted }}>
            Complete visibility across field users, trade users, management, tasks, and individual workload snapshots.
          </Typography>
        </Box>
      </Box>

      <Paper elevation={0} className="table-card" sx={{ p: "20px 22px" }}>
        <Typography
          sx={{
            fontFamily: STYLE_TOKENS.typography.fontDisplay,
            fontSize: 15,
            fontWeight: 800,
            color: STYLE_TOKENS.colors.text,
            mb: "14px",
            pb: "10px",
            borderBottom: `2px solid ${STYLE_TOKENS.colors.border}`,
            display: "flex",
            alignItems: "center",
            gap: "7px",
          }}
        >
          👥 Users
        </Typography>

        <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap", mb: "10px" }}>
          <AppButton
            variant="outlined"
            size="small"
            onClick={() => props.setTab("Management")}
            sx={{
              borderColor: props.tab === "Management" ? STYLE_TOKENS.colors.orange : STYLE_TOKENS.colors.border,
              color: STYLE_TOKENS.colors.text,
            }}
          >
            Managers
          </AppButton>
          <AppButton
            variant="outlined"
            size="small"
            onClick={() => props.setTab("Trade")}
            sx={{
              borderColor: props.tab === "Trade" ? STYLE_TOKENS.colors.orange : STYLE_TOKENS.colors.border,
              color: STYLE_TOKENS.colors.text,
            }}
          >
            Trade Users
          </AppButton>
          <AppButton
            variant="outlined"
            size="small"
            onClick={() => props.setTab("User")}
            sx={{
              borderColor: props.tab === "User" ? STYLE_TOKENS.colors.orange : STYLE_TOKENS.colors.border,
              color: STYLE_TOKENS.colors.text,
            }}
          >
            Field Users
          </AppButton>
        </Box>

        {props.roleUsersLoading ? (
          <Stack spacing={1}>
            {Array.from({ length: 6 }).map((_, idx) => (
              <Skeleton key={idx} variant="rounded" height={52} sx={{ borderRadius: "12px" }} />
            ))}
          </Stack>
        ) : props.roleUsers.length === 0 ? (
          <Typography sx={{ fontSize: 13, color: STYLE_TOKENS.colors.textMuted }}>
            No users found for this role.
          </Typography>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "12px" }}>
            {props.roleUsers.map((u) => (
              <UserRow
                key={u.id}
                u={u}
                onDetails={(user) => {
                  setActiveUser(user);
                  setDetailOpen(true);
                }}
              />
            ))}
          </Box>
        )}
      </Paper>

      <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: STYLE_TOKENS.typography.fontDisplay, fontWeight: 800 }}>
          User Details
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {activeUser ? (
            <Stack spacing={1.25}>
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 900, color: STYLE_TOKENS.colors.text }}>
                  {activeUser.full_name}
                </Typography>
                <Typography sx={{ fontSize: 13, color: STYLE_TOKENS.colors.textMuted }}>
                  {activeUser.email}
                </Typography>
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px" }}>
                <StatCard value={activeUser.open_tasks_count ?? 0} label="Open" accentColor="#F5A623" />
                <StatCard value={0} label="Completed" accentColor="#22C55E" />
                <StatCard value={0} label="Overdue" accentColor="#EF4444" />
              </Box>
              <Typography sx={{ fontSize: 12.5, color: STYLE_TOKENS.colors.textMuted }}>
                Click “Details” in HTML shows projects + recent tasks. We can add those once the API returns completed/overdue/task snapshot per user.
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <AppButton variant="outlined" onClick={() => setDetailOpen(false)}>
                  Close
                </AppButton>
              </Box>
            </Stack>
          ) : null}
        </DialogContent>
      </Dialog>
    </Stack>
  );
}

