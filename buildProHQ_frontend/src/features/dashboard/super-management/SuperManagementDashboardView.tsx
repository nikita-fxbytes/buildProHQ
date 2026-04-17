"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import type { ManagerAnalytics, RecentTaskItem, TaskListItem, TaskStats } from "@/services/tasksApi.service";
import { DashStatTile } from "@/features/dashboard/super-admin/components/DashStatTile";
import { BarChartList } from "@/features/dashboard/super-management/components/BarChartList";
import { SuperExportBar } from "@/features/dashboard/super-management/components/SuperExportBar";
import { formatRelativeTime } from "@/utils/relativeTime";

export type SuperManagementDashboardViewProps = {
  loading: boolean;
  stats: TaskStats | null;
  analytics: ManagerAnalytics | null;
  recentLoading: boolean;
  recentTasks: RecentTaskItem[];

  exportLoading: boolean;
  onExportCSV: () => Promise<{ stats: TaskStats; analytics: ManagerAnalytics; recentTasks: RecentTaskItem[] }>;
  onBuildPrintableReport: () => Promise<string>;
};

function DashboardCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
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
        {title}
      </Typography>
      {children}
    </Paper>
  );
}

export function SuperManagementDashboardView(props: SuperManagementDashboardViewProps) {
  const s = props.stats;
  const a = props.analytics;

  return (
    <Stack spacing={2}>
      <SuperExportBar
        loading={props.exportLoading}
        stats={props.stats}
        analytics={props.analytics}
        recentTasks={props.recentTasks}
        onExportCSV={props.onExportCSV}
        onBuildPrintableReport={props.onBuildPrintableReport}
      />

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2,1fr)", md: "repeat(4,1fr)" }, gap: "14px" }}>
        {props.loading || !s ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Box
              key={idx}
              sx={{
                borderRadius: "12px",
                border: `1.5px solid ${STYLE_TOKENS.colors.border}`,
                padding: "14px 16px",
                boxShadow: STYLE_TOKENS.shadow.card,
              }}
            >
              <Skeleton variant="text" width={72} height={34} />
              <Skeleton variant="text" width={120} height={18} sx={{ mt: 1 }} />
            </Box>
          ))
        ) : (
          <>
            <DashStatTile value={s.open ?? s.totalOpen ?? 0} label="Open" tone="orange" />
            <DashStatTile value={s.today ?? 0} label="Today" tone="red" />
            <DashStatTile value={s.completed ?? s.totalCompleted ?? 0} label="Completed" tone="green" />
            <DashStatTile value={s.total ?? 0} label="Total" tone="blue" />
          </>
        )}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: "20px" }}>
        <DashboardCard title="🔴 Overdue Tasks">
          {props.loading ? (
            <Stack spacing={1}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={idx} variant="rounded" height={38} sx={{ borderRadius: "8px" }} />
              ))}
            </Stack>
          ) : (a?.overdueDueTop?.length ?? 0) === 0 ? (
            <Typography sx={{ fontSize: 13, color: STYLE_TOKENS.colors.greenDark, padding: "8px" }}>
              ✅ No overdue tasks!
            </Typography>
          ) : (
            <Stack spacing={1}>
              {a!.overdueDueTop!.slice(0, 6).map((t, idx) => (
                <Box
                  key={`${t.id}-${idx}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "8px 10px",
                    background: "#FEF2F2",
                    borderRadius: "8px",
                    borderLeft: `3px solid ${STYLE_TOKENS.colors.red}`,
                  }}
                >
                  <Typography sx={{ fontFamily: STYLE_TOKENS.typography.fontDisplay, fontSize: 14, fontWeight: 700, color: STYLE_TOKENS.colors.red, minWidth: 52 }}>
                    Due
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: STYLE_TOKENS.colors.text, flex: 1 }}>
                    {t.title?.trim() || t.description}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </DashboardCard>

        <DashboardCard title="📋 Recently Added Tasks">
          {props.recentLoading ? (
            <Stack spacing={1}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <Skeleton key={idx} variant="text" height={24} />
              ))}
            </Stack>
          ) : props.recentTasks.length === 0 ? (
            <Typography sx={{ fontSize: 13, color: STYLE_TOKENS.colors.textMuted, padding: "8px" }}>
              No recent tasks.
            </Typography>
          ) : (
            <Box>
              {props.recentTasks.slice(0, 5).map((t) => (
                <Box
                  key={t.id}
                  sx={{
                    padding: "10px 0",
                    borderBottom: `1px solid ${STYLE_TOKENS.colors.border}`,
                    "&:last-of-type": { borderBottom: "none" },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      minWidth: 0,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 13.5,
                        fontWeight: 800,
                        color: STYLE_TOKENS.colors.text,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        flex: 1,
                        minWidth: 0,
                      }}
                      title={String(t.title ?? "").trim() || "—"}
                    >
                      {String(t.title ?? "").trim() || "—"}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 11.5,
                        color: STYLE_TOKENS.colors.textMuted,
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      {formatRelativeTime(t.created_at)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </DashboardCard>

        <DashboardCard title="👥 User Workload">
          {/* TODO(backend): Analytics should optionally accept role=user_type filter so this chart can be strictly management-only. */}
          <BarChartList
            rows={(a?.byUser ?? []).slice(0, 8).map((x) => ({ label: x.user, value: x.completed }))}
            accent={STYLE_TOKENS.colors.green}
            emptyText="No data yet."
          />
        </DashboardCard>

        {/* Legacy Trade/Level breakdown removed (dynamic filters only). */}
      </Box>
    </Stack>
  );
}

