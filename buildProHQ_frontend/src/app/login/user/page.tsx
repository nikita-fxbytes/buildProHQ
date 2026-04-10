import { ROUTES } from "@/constants/routes";
import { ROLES } from "@/constants/roles";
import { RoleLoginForm } from "@/features/auth/components/RoleLoginForm";

export default function LoginUserPage() {
  return (
    <RoleLoginForm
      role={ROLES.FIELD_USER}
      theme={{
        portalText: "Construction Action Item Management",
        badgeLabel: "Field User",
        badgeIcon: "fieldUser",
        badgeBackground: "#FFF3D4",
        badgeColor: "#E09010",
        inputBackground: "#FFFBF2",
        inputFocusColor: "#F5A623",
        submitBackground: "#F5A623",
        submitHoverBackground: "#E09010",
        submitHoverShadow: "0 6px 20px rgba(245,166,35,0.35)",
        emailPlaceholder: "you@buildpro.com",
        links: [
          { label: "Trade User?", text: "Trade Login", href: ROUTES.LOGIN_TRADE },
          { label: "Manager?", text: "Manager Login", href: ROUTES.LOGIN_MANAGER },
          { label: "Super Admin?", text: "Super Admin Login", href: ROUTES.LOGIN_SUPER },
        ],
      }}
    />
  );
}

