"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { PageLayout } from "@/components/layout/PageLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import type { Role } from "@/constants/roles";
import { getAllowedRolesForPortalPath } from "@/navigation/portalRole";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const allowedRoles = useMemo<Role[] | undefined>(
    () => getAllowedRolesForPortalPath(pathname),
    [pathname],
  );

  return (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <PageLayout>{children}</PageLayout>
    </ProtectedRoute>
  );
}
