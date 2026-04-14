import { STYLE_TOKENS } from "@/constants/style-tokens";
import type { SuperDashboardRoleTab } from "./taskUserMatch";

export function superTabAccent(tab: SuperDashboardRoleTab): string {
  if (tab === "Management") return STYLE_TOKENS.colors.blue;
  if (tab === "Trade") return STYLE_TOKENS.colors.green;
  return STYLE_TOKENS.colors.orange;
}
