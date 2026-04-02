"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import { ROLES, type Role } from "@/constants/roles";
import { Topbar } from "@/components/layout/Topbar";
import { PortalSidebar } from "@/components/navigation/PortalSidebar";

type PageMeta = {
  role: Role;
  title: string;
  breadcrumb: string;
};

const PAGE_MAP: Record<string, PageMeta> = {
  "/field/tasks": { role: ROLES.FIELD_USER, title: "Action Items", breadcrumb: "" },
  "/field/add-task": { role: ROLES.FIELD_USER, title: "Add Action Item", breadcrumb: "" },
  "/field/completed": { role: ROLES.FIELD_USER, title: "Completed Items", breadcrumb: "" },
  "/trade/tasks": { role: ROLES.TRADE_USER, title: "My Assigned Tasks", breadcrumb: "Trade Portal" },
  "/trade/completed": { role: ROLES.TRADE_USER, title: "My Completed Tasks", breadcrumb: "Trade Portal" },
  "/manager/tasks": { role: ROLES.MANAGER, title: "Action Items (Management)", breadcrumb: "Management" },
  "/manager/tasks/add": { role: ROLES.MANAGER, title: "Add Action Item", breadcrumb: "Management" },
  "/manager/completed": { role: ROLES.MANAGER, title: "Completed Items", breadcrumb: "Management" },
  "/manager/filters": { role: ROLES.MANAGER, title: "Manage Filters", breadcrumb: "Management" },
  "/manager/users": { role: ROLES.MANAGER, title: "Users", breadcrumb: "Management" },
  "/manager/users/add": { role: ROLES.MANAGER, title: "Add User", breadcrumb: "Management" },
};

export function PageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const meta = useMemo<PageMeta>(() => {
    return PAGE_MAP[pathname] ?? { role: ROLES.FIELD_USER, title: "Dashboard", breadcrumb: "" };
  }, [pathname]);

  return (
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "row" }}>
      <PortalSidebar role={meta.role} />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Topbar title={meta.title} breadcrumb={meta.breadcrumb} />
        <Box sx={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>{children}</Box>
      </Box>
    </Box>
  );
}
