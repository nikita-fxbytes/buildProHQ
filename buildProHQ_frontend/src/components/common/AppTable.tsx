import Box from "@mui/material/Box";

export type AppTableProps = {
  head: React.ReactNode;
  rows: React.ReactNode;
  pagination?: React.ReactNode;
  className?: string;
};

export function AppTable({ head, rows, pagination, className }: AppTableProps) {
  return (
    <Box className={className ? `table-card ${className}` : "table-card"}>
      {head}
      {rows}
      {pagination}
    </Box>
  );
}

