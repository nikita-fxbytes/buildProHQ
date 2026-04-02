import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";

export type AppTableRowProps = {
  columnsTemplate: string;
  children: React.ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
};

export function AppTableRow({ columnsTemplate, children, className, sx }: AppTableRowProps) {
  return (
    <Box
      className={className ? `table-row-standard ${className}` : "table-row-standard"}
      sx={{
        gridTemplateColumns: columnsTemplate,
        columnGap: "8px",
        ...(sx || {}),
      }}
    >
      {children}
    </Box>
  );
}
