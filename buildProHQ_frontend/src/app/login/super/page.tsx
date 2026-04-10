import { ROUTES } from "@/constants/routes";
import { ROLES } from "@/constants/roles";
import { RoleLoginForm } from "@/features/auth/components/RoleLoginForm";

export default function LoginSuperAdminPage() {
  return (
    <RoleLoginForm
      role={ROLES.SUPER_ADMIN}
      theme={{
        portalText: "Super Admin Portal",
        badgeLabel: "Super Admin",
        badgeIcon: "manager",
        badgeBackground: "#F3E8FF",
        badgeColor: "#7C3AED",
        inputBackground: "#FAF5FF",
        inputFocusColor: "#A78BFA",
        submitBackground: "#7C3AED",
        submitHoverBackground: "#6D28D9",
        submitHoverShadow: "0 6px 20px rgba(124,58,237,0.35)",
        emailPlaceholder: "super@buildpro.com",
        links: [
          { label: "Manager?", text: "Manager Login", href: ROUTES.LOGIN_MANAGER },
          { label: "Field user?", text: "Field Login", href: ROUTES.LOGIN_USER },
        ],
      }}
    />
  );
}

