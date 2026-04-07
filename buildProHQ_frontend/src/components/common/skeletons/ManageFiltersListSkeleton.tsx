"use client";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

/**
 * Placeholders matching `ManageFiltersView` filter cards (head row + chip row).
 */
export function ManageFiltersListSkeleton({ cards = 3 }: { cards?: number }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {Array.from({ length: cards }, (_, i) => (
        <Box
          key={i}
          sx={{
            border: "1px solid #E4E8F0",
            borderRadius: "10px",
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "10px",
              padding: "12px 14px",
              borderBottom: "1px solid #E4E8F0",
              background: "#F8FAFC",
            }}
          >
            <Skeleton variant="rounded" width="38%" height={22} sx={{ bgcolor: "rgba(0,0,0,0.06)" }} />
            <Box sx={{ display: "flex", gap: "6px" }}>
              <Skeleton variant="rounded" width={120} height={32} sx={{ borderRadius: "6px" }} />
              <Skeleton variant="rounded" width={88} height={32} sx={{ borderRadius: "6px" }} />
            </Box>
          </Box>
          <Box sx={{ padding: "12px 14px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {[0, 1, 2, 3].map((j) => (
              <Skeleton key={j} variant="rounded" width={72} height={26} sx={{ borderRadius: "999px" }} />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
