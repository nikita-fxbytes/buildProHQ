"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { STYLE_TOKENS } from "@/constants/style-tokens";

export type TopbarProps = {
  title: string;
  breadcrumb?: string;
};

export function Topbar({ title, breadcrumb }: TopbarProps) {
  return (
    <Box
      sx={{
        background: STYLE_TOKENS.colors.card,
        borderBottom: `1px solid ${STYLE_TOKENS.colors.border}`,
        paddingInline: "28px",
        height: `${STYLE_TOKENS.spacing.topbarHeight}px`,
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <Box>
        <Typography
          sx={{
            fontFamily: STYLE_TOKENS.typography.fontDisplay,
            fontSize: STYLE_TOKENS.typography.size.h5,
            fontWeight: 700,
            color: STYLE_TOKENS.colors.text,
            lineHeight: 1.1,
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ fontSize: STYLE_TOKENS.typography.size.label, color: STYLE_TOKENS.colors.textMuted, marginTop: "1px" }}>
          {breadcrumb ?? ""}
        </Typography>
      </Box>
      <Box sx={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }} />
    </Box>
  );
}
