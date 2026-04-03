"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

/**
 * Mirrors `FieldAddTaskView` paper layout (title, description, 2-up fields, priority row, upload, actions).
 */
export function FieldAddTaskFormSkeleton() {
  return (
    <Box sx={{ maxWidth: "640px" }}>
      <Paper
        elevation={0}
        sx={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          padding: "28px 32px",
        }}
      >
        <Box sx={{ mb: "14px", pb: "10px", borderBottom: "2px solid #E4E8F0" }}>
          <Skeleton variant="rounded" width="55%" height={28} sx={{ borderRadius: "4px", bgcolor: "rgba(0,0,0,0.06)" }} />
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
          <Box sx={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "6px" }}>
            <Skeleton variant="rounded" width={100} height={18} sx={{ bgcolor: "rgba(0,0,0,0.06)" }} />
            <Skeleton variant="rounded" height={160} sx={{ borderRadius: "8px", bgcolor: "rgba(0,0,0,0.06)" }} />
            <Stack direction="row" spacing={0.75} sx={{ justifyContent: "flex-end", pt: 0.5 }}>
              <Skeleton variant="rounded" width={32} height={32} sx={{ borderRadius: "8px" }} />
              <Skeleton variant="rounded" width={32} height={32} sx={{ borderRadius: "8px" }} />
            </Stack>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <Skeleton variant="rounded" width={72} height={18} sx={{ bgcolor: "rgba(0,0,0,0.06)" }} />
            <Skeleton variant="rounded" height={40} sx={{ borderRadius: "8px", bgcolor: "rgba(0,0,0,0.06)" }} />
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <Skeleton variant="rounded" width={56} height={18} sx={{ bgcolor: "rgba(0,0,0,0.06)" }} />
            <Skeleton variant="rounded" height={40} sx={{ borderRadius: "8px", bgcolor: "rgba(0,0,0,0.06)" }} />
          </Box>

          <Box sx={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "6px" }}>
            <Skeleton variant="rounded" width={88} height={18} sx={{ bgcolor: "rgba(0,0,0,0.06)" }} />
            <Stack direction="row" useFlexGap flexWrap="wrap" sx={{ gap: "8px" }}>
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rounded" width={92} height={36} sx={{ borderRadius: "8px" }} />
              ))}
            </Stack>
          </Box>

          <Box sx={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "6px" }}>
            <Skeleton variant="rounded" width={160} height={18} sx={{ bgcolor: "rgba(0,0,0,0.06)" }} />
            <Skeleton
              variant="rounded"
              height={120}
              sx={{
                borderRadius: "10px",
                bgcolor: "rgba(0,0,0,0.04)",
                border: "2px dashed #E4E8F0",
              }}
            />
          </Box>
        </Box>

        <Stack direction="row" spacing={1.25} sx={{ mt: "22px" }}>
          <Skeleton variant="rounded" width={180} height={40} sx={{ borderRadius: "8px" }} />
          <Skeleton variant="rounded" width={88} height={40} sx={{ borderRadius: "8px" }} />
        </Stack>
      </Paper>
    </Box>
  );
}
