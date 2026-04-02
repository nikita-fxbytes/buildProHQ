import { ROUTES } from "@/constants/routes";
import { ROLES } from "@/constants/roles";
import { RoleLoginForm } from "@/features/auth/components/RoleLoginForm";

export default function LoginTradePage() {
  return (
    <RoleLoginForm
      role={ROLES.TRADE_USER}
      theme={{
        portalText: "Trade User Portal",
        badgeLabel: "Trade User",
        badgeIcon: "tradeUser",
        badgeBackground: "#F0FFF4",
        badgeColor: "#15803D",
        inputBackground: "#F0FFF4",
        inputFocusColor: "#22C55E",
        submitBackground: "#16A34A",
        submitHoverBackground: "#15803D",
        submitHoverShadow: "0 6px 20px rgba(34,197,94,0.35)",
        emailPlaceholder: "trade@buildpro.com",
        links: [
          { label: "Field User?", text: "Field Login", href: ROUTES.LOGIN_USER },
          { label: "Manager?", text: "Manager Login", href: ROUTES.LOGIN_MANAGER },
        ],
      }}
    />
  );
}

