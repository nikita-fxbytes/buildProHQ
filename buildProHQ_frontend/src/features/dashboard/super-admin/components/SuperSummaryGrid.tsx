"use client";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { DashStatTile } from "./DashStatTile";

export type SuperSummaryGridProps = {
  initialLoading: boolean;
  openTasks: number;
  completedTasks: number;
  overdueTasks: number;
  totalUsers: number;
};

export function SuperSummaryGrid(props: SuperSummaryGridProps) {
  if (props.initialLoading) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              borderRadius: "12px",
              border: "1.5px solid #E4E8F0",
              padding: "14px 16px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
            }}
          >
            <Skeleton variant="text" width={72} height={36} />
            <Skeleton variant="text" width={120} height={20} sx={{ mt: 1 }} />
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
        gap: "16px",
        marginBottom: "20px",
      }}
    >
      <DashStatTile value={props.openTasks} label="All Open Tasks" tone="orange" />
      <DashStatTile value={props.completedTasks} label="All Completed" tone="green" />
      <DashStatTile value={props.overdueTasks} label="Overdue Tasks" tone="red" />
      <DashStatTile value={props.totalUsers} label="Total Users" tone="blue" />
    </Box>
  );
}
