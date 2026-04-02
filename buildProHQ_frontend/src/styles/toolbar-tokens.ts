import { DESIGN_TOKENS } from "@/styles/design-tokens";

export const TOOLBAR_TOKENS = {
  wrapper: {
    gap: `${DESIGN_TOKENS.spacing.toolbarGap}px`,
  },
  pageSize: {
    fontSize: "13px",
    color: DESIGN_TOKENS.colors.textMuted,
  },
} as const;
