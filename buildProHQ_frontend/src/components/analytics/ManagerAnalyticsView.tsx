"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { StatCard } from "@/components/common/StatCard";
import { AppIcon } from "@/components/common/AppIcon";
import type { ManagerAnalytics } from "@/services/tasksApi.service";

type Props = {
  loading: boolean;
  data: ManagerAnalytics | null;
  reload: () => void;
};

function StatCardRowSkeleton() {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
      {Array.from({ length: 3 }).map((_, idx) => (
        <Paper
          key={idx}
          elevation={0}
          sx={{ borderRadius: "12px", border: "1px solid #E4E8F0", p: 2 }}
        >
          <Skeleton variant="text" width={70} height={32} />
          <Skeleton variant="text" width={120} />
        </Paper>
      ))}
    </Box>
  );
}

function BarChartCard(props: {
  title: string;
  accent: string;
  rows: Array<{ label: string; value: number }>;
  emptyText: string;
}) {
  const max = Math.max(...props.rows.map((r) => r.value), 1);
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "12px",
        border: "1px solid #E4E8F0",
        p: 2,
        background: "#fff",
      }}
    >
      <Typography sx={{ fontSize: 14, fontWeight: 800, mb: 1.25 }}>
        {props.title}
      </Typography>
      {props.rows.length === 0 ? (
        <Typography sx={{ fontSize: 13, color: "#7B89A8" }}>{props.emptyText}</Typography>
      ) : (
        <Stack spacing={1}>
          {props.rows.map((r) => {
            const pct = Math.round((r.value / max) * 100);
            return (
              <Box
                key={r.label}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "120px 1fr 34px",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontSize: 12.5, color: "#1A2035", fontWeight: 700 }}>
                  {r.label}
                </Typography>
                <Box
                  sx={{
                    height: 10,
                    borderRadius: 999,
                    background: "#F3F5F9",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      width: `${pct}%`,
                      background: props.accent,
                      borderRadius: 999,
                    }}
                  />
                </Box>
                <Typography sx={{ fontSize: 12.5, color: "#7B89A8", fontWeight: 700, textAlign: "right" }}>
                  {r.value}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
}

export function ManagerAnalyticsView({ loading, data }: Props) {
  return (
    <Stack spacing={2}>
      {loading ? (
        <StatCardRowSkeleton />
      ) : data ? (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
          <StatCard value={data.openTasks} label="Open Tasks" accentColor="#F5A623" />
          <StatCard value={data.completedTotal} label="Completed Total" accentColor="#22C55E" />
          <StatCard value={`${data.avgCompletionDays}d`} label="Avg Completion Time" accentColor="#3BB0D8" />
        </Box>
      ) : (
        <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #E4E8F0", p: 2 }}>
          <Typography sx={{ fontSize: 13, color: "#7B89A8" }}>
            <AppIcon name="complete" size={16} /> Unable to load analytics.
          </Typography>
        </Paper>
      )}

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "16px" }}>
        <BarChartCard
          title="📊 Tasks by Trade"
          accent="#F5A623"
          rows={(data?.byTrade ?? []).map((x) => ({ label: x.trade, value: x.count }))}
          emptyText="No data yet."
        />
        <BarChartCard
          title="🏗 Tasks by Level"
          accent="#3BB0D8"
          rows={(data?.byLevel ?? []).map((x) => ({ label: x.level, value: x.count }))}
          emptyText="No data yet."
        />

        <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #E4E8F0", p: 2, background: "#fff" }}>
          <Typography sx={{ fontSize: 14, fontWeight: 800, mb: 1.25 }}>
            ⚠️ Overdue Tasks (10+ days)
          </Typography>
          {loading ? (
            <Stack spacing={1}>
              {Array.from({ length: 4 }).map((_, idx) => (
                <Skeleton key={idx} variant="rounded" height={34} />
              ))}
            </Stack>
          ) : (data?.overdueTop?.length ?? 0) === 0 ? (
            <Typography sx={{ fontSize: 13, color: "#16A34A", p: 1 }}>
              ✅ No overdue tasks!
            </Typography>
          ) : (
            <Stack spacing={1}>
              {data!.overdueTop.map((t, idx) => (
                <Box
                  key={`${t.description}-${idx}`}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "52px 1fr 56px",
                    gap: "10px",
                    alignItems: "center",
                    border: "1px solid #E4E8F0",
                    borderRadius: "10px",
                    p: "8px 10px",
                  }}
                >
                  <Box sx={{ fontWeight: 800, color: "#EF4444", fontSize: 13 }}>{t.daysOpen}d</Box>
                  <Typography sx={{ fontSize: 12.5, color: "#1A2035" }}>
                    {t.level ? `${t.level} · ` : ""}
                    {t.description}
                  </Typography>
                  <Box sx={{ textAlign: "right", fontWeight: 800, color: "#7B89A8", fontSize: 12 }}>
                    {t.user ?? "–"}
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </Paper>

        <BarChartCard
          title="👥 Performance by User"
          accent="#22C55E"
          rows={(data?.byUser ?? []).map((x) => ({ label: x.user, value: x.completed }))}
          emptyText="No data yet."
        />
      </Box>
    </Stack>
  );
}

