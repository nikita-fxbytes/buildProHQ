"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ROLES, type Role } from "@/constants/roles";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const allowedRoles = useMemo<Role[] | undefined>(() => {
    if (pathname.startsWith("/manager")) return [ROLES.MANAGER];
    if (pathname.startsWith("/trade")) return [ROLES.TRADE_USER];
    if (pathname.startsWith("/field")) return [ROLES.FIELD_USER];
    if (pathname.startsWith("/user")) return [ROLES.FIELD_USER];
    return undefined;
  }, [pathname]);

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <PageLayout>{children}</PageLayout>
    </ProtectedRoute>
  );
}
