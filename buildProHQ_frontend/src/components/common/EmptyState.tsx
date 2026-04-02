import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

export type EmptyStateProps = {
  icon?: ReactNode;
  message: string;
};

export function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <Box
      sx={{
        padding: 6,
        textAlign: "center",
        color: "#7B89A8",
      }}
    >
      {icon ? (
        <Typography sx={{ fontSize: 36, marginBottom: 1, display: "inline-flex", alignItems: "center" }}>
          {icon}
        </Typography>
      ) : null}
      <Typography sx={{ fontSize: 14 }}>{message}</Typography>
    </Box>
  );
}

