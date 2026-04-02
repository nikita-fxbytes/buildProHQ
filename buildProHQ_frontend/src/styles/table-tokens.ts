import { DESIGN_TOKENS } from "@/styles/design-tokens";

export const TABLE_TOKENS = {
  header: {
    bg: "#F8FAFC",
    borderBottom: `2px solid ${DESIGN_TOKENS.colors.border}`,
  },
  row: {
    borderBottom: `1px solid ${DESIGN_TOKENS.colors.border}`,
    hoverBg: "#F8FAFC",
  },
  cell: {
    level: { fontFamily: DESIGN_TOKENS.typography.fontDisplay, fontSize: "14px", fontWeight: 700 },
    trade: { fontSize: "13.5px", fontWeight: 600 },
    text: { fontSize: "13.5px", fontWeight: 400 },
    muted: { fontSize: "12px", fontWeight: 600, color: DESIGN_TOKENS.colors.textMuted },
  },
} as const;
