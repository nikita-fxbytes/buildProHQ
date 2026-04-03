"use client";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export type AppAttachmentThumbnailsSkeletonProps = {
  count?: number;
};

/** Matches ~72px task photo thumbnails in drawers. */
export function AppAttachmentThumbnailsSkeleton({ count = 4 }: AppAttachmentThumbnailsSkeletonProps) {
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton
          key={i}
          variant="rounded"
          width={72}
          height={72}
          sx={{ borderRadius: "8px", flexShrink: 0, bgcolor: "rgba(0,0,0,0.06)" }}
        />
      ))}
    </Box>
  );
}
