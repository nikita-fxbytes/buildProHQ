import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import { FILTER_TOKENS } from "@/styles/filter-tokens";

export type FilterPanelProps = {
  open: boolean;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};

export function FilterPanel({ open, children, sx }: FilterPanelProps) {
  if (!open) return null;
  return (
    <Box
      className="filter-panel"
      sx={{
        borderRadius: FILTER_TOKENS.panel.borderRadius,
        border: FILTER_TOKENS.panel.border,
        padding: FILTER_TOKENS.panel.padding,
        background: FILTER_TOKENS.panel.bg,
        ...(sx || {}),
      }}
    >
      {children}
    </Box>
  );
}
