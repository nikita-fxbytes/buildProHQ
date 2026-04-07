"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import { Topbar } from "@/components/layout/Topbar";
import { PortalSidebar } from "@/components/navigation/PortalSidebar";
import { resolvePortalPageMeta } from "@/navigation/portalPageMeta";

export function PageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const meta = useMemo(() => resolvePortalPageMeta(pathname), [pathname]);

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
