"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import { STYLE_TOKENS } from "@/constants/style-tokens";

export type AppStatCardsSkeletonProps = {
  /** Number of cards (default matches field user stats row). */
  count?: number;
};

/** Matches `StatCard` grid: `repeat(4, 1fr)` and card padding/border radius. */
export function AppStatCardsSkeleton({ count = 4 }: AppStatCardsSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: `repeat(${count}, 1fr)`, gap: "16px" }}>
      {items.map((key) => (
        <Paper
          key={key}
          elevation={0}
          sx={{
            padding: "18px 20px",
            borderRadius: `${STYLE_TOKENS.radius.card}px`,
            borderLeft: `4px solid ${STYLE_TOKENS.colors.border}`,
            boxShadow: STYLE_TOKENS.shadow.card,
          }}
        >
          <Skeleton variant="rounded" width="45%" height={32} sx={{ borderRadius: "4px", bgcolor: "rgba(0,0,0,0.06)" }} />
          <Skeleton
            variant="rounded"
            width="72%"
            height={16}
            sx={{ mt: 1, borderRadius: "4px", bgcolor: "rgba(0,0,0,0.06)" }}
          />
        </Paper>
      ))}
    </Box>
  );
}
