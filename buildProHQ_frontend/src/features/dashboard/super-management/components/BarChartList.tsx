"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { STYLE_TOKENS } from "@/constants/style-tokens";

export type BarChartRow = { label: string; value: number };

export function BarChartList({
  rows,
  accent,
  emptyText,
}: {
  rows: BarChartRow[];
  accent: string;
  emptyText: string;
}) {
  if (rows.length === 0) {
    return (
      <Typography sx={{ fontSize: 13, color: STYLE_TOKENS.colors.textMuted, padding: "8px" }}>
        {emptyText}
      </Typography>
    );
  }

  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {rows.map((r) => {
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
            <Typography sx={{ fontSize: 12.5, color: STYLE_TOKENS.colors.text, fontWeight: 700 }}>
              {r.label}
            </Typography>
            <Box sx={{ height: 10, borderRadius: 999, background: "#F3F5F9", overflow: "hidden" }}>
              <Box sx={{ height: "100%", width: `${pct}%`, background: accent, borderRadius: 999 }} />
            </Box>
            <Typography sx={{ fontSize: 12.5, color: STYLE_TOKENS.colors.textMuted, fontWeight: 700, textAlign: "right" }}>
              {r.value}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

