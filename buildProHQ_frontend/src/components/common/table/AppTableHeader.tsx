import Box from "@mui/material/Box";
import { AppIcon } from "@/components/common/AppIcon";

export type AppTableSortDirection = "asc" | "desc";

export type AppTableColumn = {
  key: string;
  label: React.ReactNode;
  sortable?: boolean;
  sortKey?: string;
};

export type AppTableHeaderProps = {
  columnsTemplate: string;
  cells?: React.ReactNode[];
  columns?: AppTableColumn[];
  sortKey?: string | null;
  sortDirection?: AppTableSortDirection;
  onSort?: (key: string) => void;
  className?: string;
};

export function AppTableHeader({
  columnsTemplate,
  cells,
  columns,
  sortKey,
  sortDirection = "asc",
  onSort,
  className,
}: AppTableHeaderProps) {
  const resolvedCells =
    columns?.map((column) => {
      if (!column.sortable) return column.label;
      const effectiveKey = column.sortKey ?? column.key;
      const active = sortKey === effectiveKey;
      return (
        <Box
          component="span"
          key={effectiveKey}
          onClick={() => onSort?.(effectiveKey)}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          {column.label}
          {active ? (
            <AppIcon name={sortDirection === "asc" ? "sortAsc" : "sortDesc"} size={11} />
          ) : null}
        </Box>
      );
    }) ?? cells ?? [];

  return (
    <Box
      className={className ? `table-head ${className}` : "table-head"}
      sx={{
        display: "grid",
        gridTemplateColumns: columnsTemplate,
        padding: "11px 20px",
        background: "#F8FAFC",
        borderBottom: "2px solid #E4E8F0",
        columnGap: "8px",
      }}
    >
      {resolvedCells.map((cell, idx) => (
        <Box key={idx} component="div" className="th">
          {cell}
        </Box>
      ))}
    </Box>
  );
}
