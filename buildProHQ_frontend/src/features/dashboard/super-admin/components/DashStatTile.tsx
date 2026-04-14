"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { STYLE_TOKENS } from "@/constants/style-tokens";

export type DashTone = "orange" | "green" | "red" | "blue";

const toneRing: Record<DashTone, string> = {
  orange: STYLE_TOKENS.colors.orange,
  green: STYLE_TOKENS.colors.green,
  red: STYLE_TOKENS.colors.red,
  blue: STYLE_TOKENS.colors.blue,
};

export type DashStatTileProps = {
  value: number | string;
  label: string;
  tone: DashTone;
  /** Smaller number size inside modals (HTML uses 26px there vs 28px on main dash) */
  compactNumber?: boolean;
};

export function DashStatTile({ value, label, tone, compactNumber }: DashStatTileProps) {
  const ring = toneRing[tone];
  return (
    <Box
      sx={{
        background: STYLE_TOKENS.colors.card,
        borderRadius: `${STYLE_TOKENS.radius.card}px`,
        padding: "14px 16px",
        border: `1.5px solid ${STYLE_TOKENS.colors.border}`,
        textAlign: "center",
        boxShadow: `${STYLE_TOKENS.shadow.card}, 0 0 0 2px ${ring} inset`,
      }}
    >
      <Typography
        sx={{
          fontFamily: STYLE_TOKENS.typography.fontDisplay,
          fontSize: compactNumber ? 26 : 28,
          fontWeight: 800,
          color: STYLE_TOKENS.colors.text,
          lineHeight: 1,
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontSize: STYLE_TOKENS.typography.size.label,
          color: STYLE_TOKENS.colors.textMuted,
          marginTop: "6px",
          fontWeight: 500,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
}
