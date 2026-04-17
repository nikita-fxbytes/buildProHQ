"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { StatCard } from "@/components/common/StatCard";
import { AppAutocomplete } from "@/components/common/AppAutocomplete";
import { STYLE_TOKENS } from "@/constants/style-tokens";

function BarChartCard(props: {
  title: string;
  accent: string;
  rows: Array<{ label: string; value: number }>;
  emptyText: string;
}) {
  const max = Math.max(...props.rows.map((r) => r.value), 1);
  return (
    <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #E4E8F0", p: 2, background: "#fff" }}>
      <Typography sx={{ fontSize: 14, fontWeight: 800, mb: 1.25 }}>{props.title}</Typography>
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
                  gridTemplateColumns: "140px 1fr 34px",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontSize: 12.5, color: "#1A2035", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {r.label}
                </Typography>
                <Box sx={{ height: 10, borderRadius: 999, background: "#F3F5F9", overflow: "hidden" }}>
                  <Box sx={{ height: "100%", width: `${pct}%`, background: props.accent, borderRadius: 999 }} />
                </Box>
                <Typography sx={{ fontSize: 12.5, color: "#7B89A8", fontWeight: 700, textAlign: "right" }}>{r.value}</Typography>
              </Box>
            );
          })}
        </Stack>
      )}
    </Paper>
  );
}

export function SuperDynamicAnalyticsView(props: {
  loading: boolean;
  projectsLoading: boolean;
  projectId: string;
  setProjectId: (v: string) => void;
  projectOptions: Array<{ value: string; label: string }>;
  cards: { total: number; completed: number; inProgress: number; overdue: number } | null;
  filters: Array<{ filterId: string; filterName: string; values: Array<{ name: string; count: number }> }>;
}) {
  const filterCards = Array.isArray(props.filters) ? props.filters : [];
  const selectedProject =
    props.projectOptions.find((o) => o.value === props.projectId) ?? null;
  const projectName = selectedProject?.label ?? "";

  return (
    <Stack spacing={2}>
      <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #E4E8F0", p: 2, background: "#fff" }}>
        <Typography sx={{ fontSize: 14, fontWeight: 800, mb: 1 }}>Select Project</Typography>
        <AppAutocomplete
          value={selectedProject}
          options={props.projectOptions}
          placeholder={props.projectsLoading ? "Loading projects..." : "Select project"}
          onChange={(v) => props.setProjectId(String((v as any)?.value ?? ""))}
        />
      </Paper>

      {!props.projectId ? (
        <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #E4E8F0", p: 2, background: "#fff" }}>
          <Typography sx={{ fontSize: 13.5, color: STYLE_TOKENS.colors.textMuted }}>
            Please select a project to view analytics.
          </Typography>
        </Paper>
      ) : (
        <>
          <Typography sx={{ fontSize: 14, fontWeight: 900, color: STYLE_TOKENS.colors.text, px: 0.25 }}>
            Analytics for Project: {projectName || "—"}
          </Typography>

          {props.loading ? (
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <Paper key={i} elevation={0} sx={{ borderRadius: "12px", border: "1px solid #E4E8F0", p: 2 }}>
                  <Skeleton variant="text" width={70} height={34} />
                  <Skeleton variant="text" width={120} />
                </Paper>
              ))}
            </Box>
          ) : (
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
              <StatCard value={props.cards?.total ?? 0} label="Total Tasks" accentColor="#3BB0D8" />
              <StatCard value={props.cards?.completed ?? 0} label="Completed" accentColor="#22C55E" />
              <StatCard value={props.cards?.inProgress ?? 0} label="In Progress" accentColor="#F5A623" />
              <StatCard value={props.cards?.overdue ?? 0} label="Overdue" accentColor="#EF4444" />
            </Box>
          )}

          {!props.loading && filterCards.length === 0 ? (
            <Paper elevation={0} sx={{ borderRadius: "12px", border: "1px solid #E4E8F0", p: 2, background: "#fff" }}>
              <Typography sx={{ fontSize: 13.5, color: STYLE_TOKENS.colors.textMuted }}>
                No filters available for this project.
              </Typography>
            </Paper>
          ) : null}

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "16px" }}>
            {filterCards.map((f, idx) => {
              const values = Array.isArray(f.values) ? f.values : [];
              if (values.length <= 1) {
                const v = values[0];
                return (
                  <Paper
                    key={f.filterId}
                    elevation={0}
                    sx={{ borderRadius: "12px", border: "1px solid #E4E8F0", p: 2, background: "#fff" }}
                  >
                    <Typography sx={{ fontSize: 14, fontWeight: 800, mb: 0.5 }}>{f.filterName}</Typography>
                    <Typography sx={{ fontSize: 13, color: "#7B89A8" }}>{v ? v.name : "No data yet."}</Typography>
                    <Typography sx={{ mt: 1, fontSize: 22, fontWeight: 900, color: STYLE_TOKENS.colors.text }}>
                      {v ? v.count : 0}
                    </Typography>
                  </Paper>
                );
              }
              const accent = ["#F5A623", "#3BB0D8", "#22C55E", "#8B5CF6"][idx % 4];
              return (
                <BarChartCard
                  key={f.filterId}
                  title={f.filterName}
                  accent={accent}
                  rows={values.map((x) => ({ label: x.name, value: x.count }))}
                  emptyText="No data yet."
                />
              );
            })}
          </Box>
        </>
      )}

    </Stack>
  );
}

