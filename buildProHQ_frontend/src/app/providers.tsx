"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/contexts/AuthContext";
import { BuildProProvider } from "@/features/buildpro/BuildProProvider";
import { appTheme } from "@/theme/theme";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <AuthProvider>
        <BuildProProvider>{children}</BuildProProvider>
      </AuthProvider>
      <ToastContainer position="bottom-right" autoClose={3200} />
    </ThemeProvider>
  );
}
