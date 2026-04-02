import { ROUTES } from "@/constants/routes";
import { ROLES } from "@/constants/roles";
import { RoleLoginForm } from "@/features/auth/components/RoleLoginForm";

export default function LoginManagerPage() {
  return (
    <RoleLoginForm
      role={ROLES.MANAGER}
      theme={{
        portalText: "Manager / Admin Portal",
        badgeLabel: "Manager HQ",
        badgeIcon: "manager",
        badgeBackground: "#EEF2FF",
        badgeColor: "#2E3D5C",
        inputBackground: "#F0FBFF",
        inputFocusColor: "#3BB0D8",
        submitBackground: "#2E3D5C",
        submitHoverBackground: "#1C2333",
        submitHoverShadow: "0 6px 20px rgba(15,23,42,0.35)",
        emailPlaceholder: "manager@buildpro.com",
        links: [{ label: "Field user?", text: "Switch to User Login", href: ROUTES.LOGIN_USER }],
      }}
    />
  );
}

