"use client";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

export type AppGridTableSkeletonProps = {
  /** Same `grid-template-columns` as `AppTableRow` / `AppTableHeader`. */
  columnsTemplate: string;
  /** How many body rows to show (header is assumed already rendered above). */
  rowCount?: number;
  /**
   * Optional per-column skeleton kinds to match the real table cells 1:1.
   * If not provided, falls back to generic full-width skeleton bars.
   */
  columnKinds?: Array<"checkbox" | "text" | "avatars" | "chip" | "date" | "icons">;
};

function columnCountFromTemplate(columnsTemplate: string): number {
  return columnsTemplate.trim().split(/\s+/).filter(Boolean).length;
}

function CellSkeleton(props: { kind: NonNullable<AppGridTableSkeletonProps["columnKinds"]>[number]; index: number }) {
  const kind = props.kind;
  if (kind === "checkbox") {
    return <Skeleton variant="rounded" width={18} height={18} sx={{ borderRadius: "4px", bgcolor: "rgba(0,0,0,0.06)" }} />;
  }
  if (kind === "avatars") {
    return (
      <Stack direction="row" spacing={0.5} alignItems="center">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton
            key={i}
            variant="circular"
            width={28}
            height={28}
            sx={{ bgcolor: "rgba(0,0,0,0.06)" }}
          />
        ))}
      </Stack>
    );
  }
  if (kind === "chip") {
    return (
      <Skeleton
        variant="rounded"
        height={22}
        width={72}
        sx={{ borderRadius: "999px", bgcolor: "rgba(0,0,0,0.06)" }}
      />
    );
  }
  if (kind === "icons") {
    return (
      <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="flex-end" sx={{ width: "100%" }}>
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            width={34}
            height={34}
            sx={{ borderRadius: "8px", bgcolor: "rgba(0,0,0,0.06)" }}
          />
        ))}
      </Stack>
    );
  }
  if (kind === "date") {
    return (
      <Skeleton
        variant="rounded"
        height={18}
        width="60%"
        sx={{ borderRadius: "4px", bgcolor: "rgba(0,0,0,0.06)" }}
      />
    );
  }
  // text
  const width =
    props.index === 2 ? "70%" : // title / task name
    props.index === 3 ? "95%" : // description
    "80%";
  return (
    <Skeleton
      variant="rounded"
      height={18}
      width={width}
      sx={{
        borderRadius: "4px",
        bgcolor: "rgba(0,0,0,0.06)",
      }}
    />
  );
}

/**
 * Body rows only — use when the real `AppTableHeader` stays mounted (matches table layout).
 */
export function AppGridTableSkeleton({
  columnsTemplate,
  rowCount = 6,
  columnKinds,
}: AppGridTableSkeletonProps) {
  const n = columnCountFromTemplate(columnsTemplate);
  const rows = Array.from({ length: rowCount }, (_, i) => i);
  const kinds = Array.isArray(columnKinds) && columnKinds.length === n ? columnKinds : null;

  return (
    <>
      {rows.map((key) => (
        <Box
          key={key}
          className="table-row-standard"
          sx={{
            gridTemplateColumns: columnsTemplate,
            columnGap: "8px",
            minHeight: "56px",
            padding: "12px 16px",
          }}
        >
          {Array.from({ length: n }, (_, j) => (
            <Box key={j} sx={{ minWidth: 0, display: "flex", alignItems: "center" }}>
              {kinds ? (
                <CellSkeleton kind={kinds[j]} index={j} />
              ) : (
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
              )}
            </Box>
          ))}
        </Box>
      ))}
    </>
  );
}
