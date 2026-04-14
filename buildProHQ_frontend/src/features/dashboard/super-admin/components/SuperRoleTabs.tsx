"use client";

import Box from "@mui/material/Box";
import { AppButton } from "@/components/common/AppButton";
import type { SuperDashboardRoleTab } from "../taskUserMatch";

export type SuperRoleTabsProps = {
  tab: SuperDashboardRoleTab;
  onChange: (tab: SuperDashboardRoleTab) => void;
};

export function SuperRoleTabs({ tab, onChange }: SuperRoleTabsProps) {
  return (
    <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap", mb: "10px" }}>
      <AppButton
        size="small"
        variant={tab === "Management" ? undefined : "outlined"}
        onClick={() => onChange("Management")}
      >
        Managers
      </AppButton>
      <AppButton
        size="small"
        variant={tab === "Trade" ? undefined : "outlined"}
        onClick={() => onChange("Trade")}
      >
        Trade Users
      </AppButton>
      <AppButton
        size="small"
        variant={tab === "User" ? undefined : "outlined"}
        onClick={() => onChange("User")}
      >
        Field Users
      </AppButton>
    </Box>
  );
}
