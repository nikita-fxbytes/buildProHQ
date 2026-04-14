"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import type { TaskListItem } from "@/services/tasksApi.service";

function daysTone(days: number): "urgent" | "warn" | "ok" {
  if (days > 10) return "urgent";
  if (days > 6) return "warn";
  return "ok";
}

const badgeSx = {
  urgent: { background: "#FEE2E2", color: STYLE_TOKENS.colors.red },
  warn: { background: "#FFF7ED", color: "#EA580C" },
  ok: { background: "#F0F9FF", color: STYLE_TOKENS.colors.blue },
} as const;

export type SuperTaskSnapshotListProps = {
  tasks: TaskListItem[];
};

export function SuperTaskSnapshotList({ tasks }: SuperTaskSnapshotListProps) {
  if (tasks.length === 0) {
    return (
      <Typography sx={{ fontSize: 12, color: STYLE_TOKENS.colors.textMuted, padding: "8px 2px" }}>
        ✅ No open tasks for this user.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
      {tasks.map((t) => {
        const tone = daysTone(t.days_open);
        return (
          <Box
            key={t.id}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              border: `1.5px solid ${STYLE_TOKENS.colors.border}`,
              borderRadius: "12px",
              background: "#fff",
              padding: "10px 12px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: STYLE_TOKENS.typography.fontDisplay,
                  fontWeight: 900,
                  fontSize: 14,
                  color: STYLE_TOKENS.colors.text,
                  minWidth: 32,
                }}
              >
                {t.level_name || "—"}
              </Typography>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: STYLE_TOKENS.colors.text,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {t.description}
                </Typography>
                <Typography sx={{ fontSize: 12, color: STYLE_TOKENS.colors.textMuted, marginTop: "2px" }}>
                  {t.project_name || "—"}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flexShrink: 0 }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "4px 10px",
                  borderRadius: "999px",
                  fontSize: 12,
                  fontWeight: 900,
                  fontFamily: STYLE_TOKENS.typography.fontDisplay,
                  ...badgeSx[tone],
                }}
              >
                {t.days_open}d
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
