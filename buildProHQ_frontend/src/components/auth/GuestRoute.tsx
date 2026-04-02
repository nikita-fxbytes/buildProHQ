"use client";

import React, { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_HOME_ROUTES } from "@/constants/routes";

type GuestRouteProps = {
  children: React.ReactNode;
};

/**
 * For public-only routes (e.g. login). Authenticated users are sent to their role home.
 */
export function GuestRoute({ children }: GuestRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      router.replace(ROLE_HOME_ROUTES[user.role]);
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isAuthenticated && user) {
    return (
      <Box sx={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center" }}>
        <CircularProgress size={24} sx={{ mr: 1.5 }} />
        Redirecting to your dashboard...
      </Box>
    );
  }

  return <>{children}</>;
}
