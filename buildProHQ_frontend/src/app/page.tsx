"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_HOME_ROUTES, ROUTES } from "@/constants/routes";

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    router.replace(ROLE_HOME_ROUTES[user.role] ?? ROUTES.LOGIN);
  }, [isLoading, isAuthenticated, user, router]);

  return (
    <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
      <CircularProgress />
    </Box>
  );
}
