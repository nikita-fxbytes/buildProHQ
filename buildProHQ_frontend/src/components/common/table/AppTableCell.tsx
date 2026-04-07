import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

type Variant = "level" | "trade" | "text" | "muted" | "default";

export type AppTableCellProps = {
  variant?: Variant;
  children: React.ReactNode;
  component?: React.ElementType;
  className?: string;
  sx?: SxProps<Theme>;
};

const VARIANT_CLASS: Record<Variant, string | undefined> = {
  level: "table-cell-level",
  trade: "table-cell-trade",
  text: "table-cell-text",
  muted: "table-cell-muted",
  default: undefined,
};

export function AppTableCell({
  variant = "default",
  children,
  component = "span",
  className,
  sx,
}: AppTableCellProps) {
  const variantClass = VARIANT_CLASS[variant];
  const merged = [variantClass, className].filter(Boolean).join(" ") || undefined;
  return (
    <Box component={component} className={merged} sx={sx}>
      {children}
    </Box>
  );
}
