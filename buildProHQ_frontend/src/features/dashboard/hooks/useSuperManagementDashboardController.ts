"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MESSAGES } from "@/constants/messages";
import { appToast } from "@/utils/toast";
import { tasksApi, type ManagerAnalytics, type RecentTaskItem, type TaskStats } from "@/services/tasksApi.service";
import { formatDateTime } from "@/utils/date";
// This dashboard is monitoring-only; no user list fetched here.

function buildPrintableReportHtml(params: {
  stats: TaskStats;
  analytics: ManagerAnalytics;
  recentTasks: RecentTaskItem[];
}) {
  const now = formatDateTime(new Date());
  const esc = (s: string) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  const recentRows = params.recentTasks
    .map(
      (t) =>
        `<tr><td>${esc(t.title ?? t.description)}</td><td>${esc(t.project_name ?? "—")}</td><td>${esc(
          t.status_name ?? "—",
        )}</td><td>${esc(t.created_at ?? "—")}</td></tr>`,
    )
    .join("");

  const overdueRows = params.analytics.overdueTop
    .slice(0, 25)
    .map(
      (t) =>
        `<tr><td>${t.daysOpen}d</td><td>${esc(t.description)}</td><td>${esc(t.user ?? "—")}</td></tr>`,
    )
    .join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>BuildProHQ — Management Dashboard Report</title>
  <style>
    body{font-family: Inter, Arial, sans-serif;padding:24px;color:#1A2035;}
    h1{font-family: Rajdhani, Arial, sans-serif;font-size:24px;margin:0 0 6px;}
    .meta{color:#7B89A8;font-size:13px;margin-bottom:16px;}
    .cards{display:flex;gap:12px;flex-wrap:wrap;margin:16px 0;}
    .card{border:1.5px solid #E4E8F0;border-radius:12px;padding:12px 14px;min-width:160px;}
    .num{font-family: Rajdhani, Arial, sans-serif;font-size:28px;font-weight:800;}
    .lbl{color:#7B89A8;font-size:12px;margin-top:4px;}
    table{width:100%;border-collapse:collapse;margin:10px 0 18px;font-size:12px;}
    th{background:#1C2333;color:#fff;padding:8px 10px;text-align:left;}
    td{padding:7px 10px;border-bottom:1px solid #E4E8F0;}
    tr:nth-child(even){background:#F8FAFC;}
    .section{margin-top:18px;}
  </style>
</head>
<body>
  <h1>🏢 BuildProHQ — Management Dashboard</h1>
  <div class="meta">Generated: ${esc(now)}</div>
  <div class="cards">
    <div class="card"><div class="num">${params.stats.totalOpen}</div><div class="lbl">Open Tasks</div></div>
    <div class="card"><div class="num">${params.stats.overdue10}</div><div class="lbl">Overdue (10+ days)</div></div>
    <div class="card"><div class="num">${params.stats.totalCompleted}</div><div class="lbl">Completed</div></div>
    <div class="card"><div class="num">${params.stats.urgent}</div><div class="lbl">High Priority</div></div>
  </div>

  <div class="section">
    <h2>🔴 Overdue Tasks (Top 25)</h2>
    <table>
      <tr><th>Days</th><th>Description</th><th>User</th></tr>
      ${overdueRows || "<tr><td colspan='3'>No overdue tasks.</td></tr>"}
    </table>
  </div>

  <div class="section">
    <h2>📋 Recently Added Tasks</h2>
    <table>
      <tr><th>Title</th><th>Project</th><th>Status</th><th>Created</th></tr>
      ${recentRows || "<tr><td colspan='4'>No recent tasks.</td></tr>"}
    </table>
  </div>
</body>
</html>`;
}

export function useSuperManagementDashboardController() {
  const recentLimit = 5;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [analytics, setAnalytics] = useState<ManagerAnalytics | null>(null);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentTasks, setRecentTasks] = useState<RecentTaskItem[]>([]);

  // NOTE: This dashboard is monitoring-only (no user management list/modal).

  const loadCore = useCallback(async () => {
    setLoading(true);
    try {
      const [s, a] = await Promise.all([tasksApi.getStats({ scope: "all" }), tasksApi.getAnalytics()]);
      setStats(s);
      setAnalytics(a);
    } catch {
      appToast.error(MESSAGES.common.somethingWrong);
      setStats(null);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRecent = useCallback(async () => {
    setRecentLoading(true);
    try {
      const items = await tasksApi.listRecentTasks(recentLimit);
      // Debug + safety: ensure no duplicate IDs render.
      const unique = Array.from(new Map(items.map((t) => [t.id, t])).values());
      setRecentTasks(unique);
    } catch {
      appToast.error(MESSAGES.common.somethingWrong);
      setRecentTasks([]);
    } finally {
      setRecentLoading(false);
    }
  }, []);

  // (User snapshot logic intentionally removed from this page.)

  useEffect(() => {
    void loadCore();
    void loadRecent();
  }, [loadCore, loadRecent]);

  // Real-time refresh when tasks mutate (create/update/delete).
  useEffect(() => {
    const onChanged = () => {
      void loadCore();
      void loadRecent();
    };
    window.addEventListener("buildprohq:tasksChanged", onChanged);
    return () => window.removeEventListener("buildprohq:tasksChanged", onChanged);
  }, [loadCore, loadRecent]);

  const exportLoading = useMemo(() => loading || recentLoading, [loading, recentLoading]);

  const exportCSV = useCallback(async () => {
    // Fetch fresh export window (still API-based). Cap to keep payload light.
    const [s, a, recent] = await Promise.all([
      tasksApi.getStats(),
      tasksApi.getAnalytics(),
      tasksApi.listRecentTasks(10),
    ]);
    return { stats: s, analytics: a, recentTasks: recent };
  }, []);

  const buildPrintableReport = useCallback(async () => {
    const data = await exportCSV();
    return buildPrintableReportHtml(data);
  }, [exportCSV]);

  return {
    loading,
    stats,
    analytics,
    recentLoading,
    recentTasks,
    exportLoading,
    exportCSV,
    buildPrintableReport,
  };
}

