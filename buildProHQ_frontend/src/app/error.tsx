"use client";

import { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AppButton } from "@/components/common/AppButton";
import { MESSAGES } from "@/constants/messages";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Route error boundary triggered", error);
  }, [error]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        px: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        {MESSAGES.common.pageCrashed}
      </Typography>
      <Typography sx={{ color: "text.secondary", maxWidth: 520 }}>
        {MESSAGES.common.serverError}
      </Typography>
      <AppButton type="button" variant="contained" onClick={reset}>
        Try again
      </AppButton>
    </Box>
  );
}
