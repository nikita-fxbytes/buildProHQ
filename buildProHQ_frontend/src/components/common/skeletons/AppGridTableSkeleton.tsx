"use client";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export type AppGridTableSkeletonProps = {
  /** Same `grid-template-columns` as `AppTableRow` / `AppTableHeader`. */
  columnsTemplate: string;
  /** How many body rows to show (header is assumed already rendered above). */
  rowCount?: number;
};

function columnCountFromTemplate(columnsTemplate: string): number {
  return columnsTemplate.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Body rows only — use when the real `AppTableHeader` stays mounted (matches table layout).
 */
export function AppGridTableSkeleton({
  columnsTemplate,
  rowCount = 6,
}: AppGridTableSkeletonProps) {
  const n = columnCountFromTemplate(columnsTemplate);
  const rows = Array.from({ length: rowCount }, (_, i) => i);

  return (
    <>
      {rows.map((key) => (
        <Box
          key={key}
          className="table-row-standard"
          sx={{
            gridTemplateColumns: columnsTemplate,
            columnGap: "8px",
          }}
        >
          {Array.from({ length: n }, (_, j) => (
            <Box key={j} sx={{ minWidth: 0, display: "flex", alignItems: "center" }}>
              <Skeleton
                variant="rounded"
                height={20}
                width="100%"
                sx={{
                  borderRadius: "4px",
                  bgcolor: "rgba(0,0,0,0.06)",
                  maxWidth: j === n - 1 && n > 4 ? 84 : "100%",
                }}
              />
            </Box>
          ))}
        </Box>
      ))}
    </>
  );
}
