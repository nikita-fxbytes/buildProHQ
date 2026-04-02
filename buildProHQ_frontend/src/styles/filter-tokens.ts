import { DESIGN_TOKENS } from "@/styles/design-tokens";

export const FILTER_TOKENS = {
  panel: {
    border: `1.5px solid ${DESIGN_TOKENS.colors.border}`,
    borderRadius: `${DESIGN_TOKENS.radius.card}px`,
    padding: "16px 20px",
    bg: DESIGN_TOKENS.colors.card,
  },
  groupLabel: {
    fontSize: "11px",
    fontWeight: 700,
    color: DESIGN_TOKENS.colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
} as const;
