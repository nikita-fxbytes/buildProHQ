"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AppButton } from "@/components/common/AppButton";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import type { ManagerAnalytics, RecentTaskItem, TaskStats } from "@/services/tasksApi.service";

function downloadFile(filename: string, content: BlobPart, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function csvEscape(v: string) {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

export type SuperExportBarProps = {
  loading: boolean;
  stats: TaskStats | null;
  analytics: ManagerAnalytics | null;
  recentTasks: RecentTaskItem[];
  onExportCSV: () => Promise<{ stats: TaskStats; analytics: ManagerAnalytics; recentTasks: RecentTaskItem[] }>;
  onBuildPrintableReport: () => Promise<string>;
};

export function SuperExportBar(props: SuperExportBarProps) {
  return (
    <Box
      className="export-bar"
      sx={{
        display: "flex",
        gap: "10px",
        flexWrap: "wrap",
        alignItems: "center",
        marginBottom: "20px",
      }}
    >
      <Typography sx={{ fontSize: 13, color: STYLE_TOKENS.colors.textMuted, fontWeight: 600, marginRight: "4px" }}>
        📤 Export:
      </Typography>
      <AppButton
        variant="outlined"
        size="small"
        disabled={props.loading}
        onClick={async () => {
          const data = await props.onExportCSV();
          const rows: string[][] = [];
          rows.push(["Section", "Metric", "Value"]);
          rows.push(["Summary", "Open Tasks", String(data.stats.totalOpen)]);
          rows.push(["Summary", "Completed", String(data.stats.totalCompleted)]);
          rows.push(["Summary", "Overdue (10+ days)", String(data.stats.overdue10)]);
          rows.push(["Summary", "High Priority (urgent)", String(data.stats.urgent)]);

          rows.push([]);
          rows.push(["OverdueTop", "Days", "Description", "User"]);
          for (const t of data.analytics.overdueTop.slice(0, 25)) {
            rows.push([String(t.daysOpen), t.description ?? "", t.user ?? ""]);
          }

          rows.push([]);
          rows.push(["RecentTasks", "Title", "Project", "Status", "CreatedAt"]);
          for (const t of data.recentTasks) {
            rows.push([
              t.title ?? t.description ?? "",
              t.project_name ?? "",
              t.status_name ?? "",
              t.created_at ?? "",
            ]);
          }

          const csv = rows
            .map((r) => r.map((x) => csvEscape(x ?? "")).join(","))
            .join("\n");
          downloadFile(`BuildProHQ_ManagementDashboard_${new Date().toISOString().slice(0, 10)}.csv`, csv, "text/csv;charset=utf-8");
        }}
      >
        📊 Export CSV
      </AppButton>

      <AppButton
        variant="outlined"
        size="small"
        disabled={props.loading}
        onClick={async () => {
          const html = await props.onBuildPrintableReport();
          const w = window.open("", "_blank");
          if (!w) return;
          w.document.write(html);
          w.document.close();
          w.focus();
          w.print();
        }}
      >
        📄 Export PDF Report
      </AppButton>
    </Box>
  );
}

