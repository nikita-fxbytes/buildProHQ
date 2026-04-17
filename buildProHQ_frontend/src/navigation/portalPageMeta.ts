import { ROLES, type Role } from "@/constants/roles";
import { resolvePortalRoleFromPathname } from "@/navigation/portalRole";

export type PortalPageMeta = {
  role: Role;
  title: string;
  breadcrumb: string;
};

/**
 * Exact pathname → title/breadcrumb. Unlisted paths still get correct role from
 * pathname prefix (resolvePortalRoleFromPathname); title falls back to inferTitleFromPath.
 */
const EXACT_PAGE_META: Record<string, PortalPageMeta> = {
  "/super/dashboard": { role: ROLES.SUPER_ADMIN, title: "Super Admin Dashboard", breadcrumb: "Super Admin" },
  "/super/projects": { role: ROLES.SUPER_ADMIN, title: "Projects", breadcrumb: "Super Admin" },
  "/super/management-dashboard": { role: ROLES.SUPER_ADMIN, title: "Management Dashboard", breadcrumb: "Super Admin" },
  "/super/tasks": { role: ROLES.SUPER_ADMIN, title: "All Action Items", breadcrumb: "Super Admin" },
  "/super/completed": { role: ROLES.SUPER_ADMIN, title: "All Completed", breadcrumb: "Super Admin" },
  "/super/analytics": { role: ROLES.SUPER_ADMIN, title: "Analytics", breadcrumb: "Super Admin" },
  "/super/users": { role: ROLES.SUPER_ADMIN, title: "Users", breadcrumb: "Super Admin" },
  "/super/users/add": { role: ROLES.SUPER_ADMIN, title: "Add User", breadcrumb: "Super Admin" },
  "/super/filters": { role: ROLES.SUPER_ADMIN, title: "Filters", breadcrumb: "Super Admin" },
  "/super/filters/new": { role: ROLES.SUPER_ADMIN, title: "Add Filter", breadcrumb: "Super Admin" },
  "/super/tasks/create": { role: ROLES.SUPER_ADMIN, title: "Create Task", breadcrumb: "Super Admin" },
  "/field/tasks": { role: ROLES.FIELD_USER, title: "Action Items", breadcrumb: "" },
  "/field/add-task": { role: ROLES.FIELD_USER, title: "Add Action Item", breadcrumb: "" },
  "/field/completed": { role: ROLES.FIELD_USER, title: "Completed Items", breadcrumb: "" },
  "/user/tasks": { role: ROLES.FIELD_USER, title: "Action Items", breadcrumb: "" },
  "/user/completed": { role: ROLES.FIELD_USER, title: "Completed Items", breadcrumb: "" },
  "/trade/tasks": { role: ROLES.TRADE_USER, title: "My Assigned Tasks", breadcrumb: "Trade Portal" },
  "/trade/completed": { role: ROLES.TRADE_USER, title: "My Completed Tasks", breadcrumb: "Trade Portal" },
  "/manager/tasks": { role: ROLES.MANAGER, title: "Action Items (Management)", breadcrumb: "Management" },
  "/manager/tasks/add": { role: ROLES.MANAGER, title: "Add Action Item", breadcrumb: "Management" },
  "/manager/completed": { role: ROLES.MANAGER, title: "Completed Items", breadcrumb: "Management" },
  "/manager/analytics": { role: ROLES.MANAGER, title: "Analytics Dashboard", breadcrumb: "Management" },
  "/manager/filters": { role: ROLES.MANAGER, title: "Manage Filters", breadcrumb: "Management" },
  "/manager/users": { role: ROLES.MANAGER, title: "Users", breadcrumb: "Management" },
  "/manager/users/add": { role: ROLES.MANAGER, title: "Add User", breadcrumb: "Management" },
};

function inferTitleFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "Dashboard";
  const last = segments[segments.length - 1] ?? "Page";
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(last)) {
    return "Details";
  }
  return last
    .split("-")
    .map((s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s))
    .join(" ");
}

function defaultBreadcrumbForRole(role: Role): string {
  if (role === ROLES.SUPER_ADMIN) return "Super Admin";
  if (role === ROLES.MANAGER) return "Management";
  if (role === ROLES.TRADE_USER) return "Trade Portal";
  return "";
}

export function resolvePortalPageMeta(pathname: string): PortalPageMeta {
  const exact = EXACT_PAGE_META[pathname];
  if (exact) {
    return { role: exact.role, title: exact.title, breadcrumb: exact.breadcrumb };
  }

  if (/^\/manager\/users\/[^/]+\/edit$/.test(pathname)) {
    return {
      role: ROLES.MANAGER,
      title: "Edit User",
      breadcrumb: "Management",
    };
  }
  if (/^\/super\/users\/[^/]+\/edit$/.test(pathname)) {
    return {
      role: ROLES.SUPER_ADMIN,
      title: "Edit User",
      breadcrumb: "Super Admin",
    };
  }
  if (/^\/super\/filters\/[^/]+\/edit$/.test(pathname)) {
    return {
      role: ROLES.SUPER_ADMIN,
      title: "Edit Filter",
      breadcrumb: "Super Admin",
    };
  }

  const role = resolvePortalRoleFromPathname(pathname);
  return {
    role,
    title: inferTitleFromPath(pathname),
    breadcrumb: defaultBreadcrumbForRole(role),
  };
}
