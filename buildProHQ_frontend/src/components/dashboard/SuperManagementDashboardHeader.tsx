"use client";

import Box from "@mui/material/Box";
import { AppButton } from "@/components/common/AppButton";

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function SuperManagementDashboardHeader() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        flexWrap: "wrap",
        mb: 2,
      }}
    >
      <AppButton
        variant="outlined"
        size="small"
        onClick={() => downloadText("buildprohq-dashboard-export.csv", "Export is coming soon.\n")}
      >
        📊 Export CSV
      </AppButton>
      <AppButton
        variant="outlined"
        size="small"
        onClick={() => downloadText("buildprohq-dashboard-report.txt", "Export is coming soon.\n")}
      >
        📄 Export Report
      </AppButton>
    </Box>
  );
}

