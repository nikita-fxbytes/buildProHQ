"use client";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import type { TaskListItem } from "@/services/tasksApi.service";
import type { UserListItem } from "@/services/usersApi.service";
import type { SuperDashboardRoleTab } from "../taskUserMatch";
import { superTabAccent } from "../superDashboardUi";
import { DashStatTile } from "./DashStatTile";
import { SuperTaskSnapshotList } from "./SuperTaskSnapshotList";

export type SuperUserDetailModalProps = {
  open: boolean;
  onClose: () => void;
  tab: SuperDashboardRoleTab;
  user: UserListItem | null;
  loading: boolean;
  /** Distinct project count from open tasks in the fetched window (approximate). */
  projectsApprox: number | null;
  snapshotTasks: TaskListItem[];
};

export function SuperUserDetailModal({
  open,
  onClose,
  tab,
  user,
  loading,
  projectsApprox,
  snapshotTasks,
}: SuperUserDetailModalProps) {
  const accent = superTabAccent(tab);
  const initials = user ? (user.initials || "?").toUpperCase().slice(0, 3) : "";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      scroll="paper"
      slotProps={{
        backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.45)" } },
      }}
      PaperProps={{
        sx: {
          width: "min(920px, calc(100vw - 40px))",
          maxHeight: "min(680px, calc(100vh - 40px))",
          borderRadius: "16px",
          boxShadow: STYLE_TOKENS.shadow.lg,
          overflow: "hidden",
          margin: "20px",
        },
      }}
    >
      <Box
        sx={{
          padding: "16px 18px",
          borderBottom: `1px solid ${STYLE_TOKENS.colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
          {user ? (
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: STYLE_TOKENS.typography.fontDisplay,
                fontSize: 16,
                fontWeight: 900,
                color: "#fff",
                background: accent,
                flexShrink: 0,
              }}
            >
              {initials}
            </Box>
          ) : null}
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontFamily: STYLE_TOKENS.typography.fontDisplay,
                fontSize: 18,
                fontWeight: 800,
                color: STYLE_TOKENS.colors.text,
              }}
            >
              {user?.full_name ?? "Details"}
            </Typography>
            <Typography sx={{ fontSize: 12, color: STYLE_TOKENS.colors.textMuted, marginTop: "2px" }}>
              {user?.email ?? ""}
            </Typography>
          </Box>
        </Box>
        <IconButton
          aria-label="Close"
          onClick={onClose}
          sx={{
            borderRadius: "10px",
            color: STYLE_TOKENS.colors.text,
            "&:hover": { background: "#F3F4F6" },
          }}
        >
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ padding: "16px 18px", overflow: "auto" }}>
        {loading || !user ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4,1fr)" }, gap: "12px" }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" height={90} sx={{ borderRadius: "12px" }} />
              ))}
            </Box>
            <Skeleton variant="text" width={200} />
            <Skeleton variant="rounded" height={72} sx={{ borderRadius: "12px" }} />
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "repeat(2, minmax(0,1fr))", sm: "repeat(4, minmax(0,1fr))" },
                gap: "12px",
                marginTop: "12px",
              }}
            >
              <DashStatTile
                value={projectsApprox ?? "—"}
                label="Projects"
                tone="blue"
                compactNumber
              />
              <DashStatTile value={user.open_tasks_count ?? 0} label="Open" tone="orange" compactNumber />
              <DashStatTile
                value={user.completed_tasks_count ?? 0}
                label="Completed"
                tone="green"
                compactNumber
              />
              <DashStatTile
                value={user.overdue_tasks_count ?? 0}
                label="Overdue"
                tone="red"
                compactNumber
              />
            </Box>
            <Typography
              sx={{
                marginTop: "16px",
                fontSize: 12,
                color: STYLE_TOKENS.colors.textMuted,
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "0.8px",
              }}
            >
              User dashboard snapshot
            </Typography>
            <SuperTaskSnapshotList tasks={snapshotTasks} />
            <Typography sx={{ fontSize: 11, color: STYLE_TOKENS.colors.textMuted, marginTop: "12px", lineHeight: 1.45 }}>
              TODO(backend): Add an assignee/user filter to <code style={{ fontFamily: STYLE_TOKENS.typography.fontBody }}>/v1/tasks/open</code>{" "}
              (and a user→project membership endpoint) so this modal can show exact project counts and recent tasks without
              pulling a global list.
            </Typography>
          </>
        )}
      </Box>
    </Dialog>
  );
}
