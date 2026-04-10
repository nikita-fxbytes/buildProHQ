import { ROLES, type Role } from "@/constants/roles";

/**
 * Single source for which role may access a portal URL segment.
 * Used by ProtectedRoute and by layout/sidebar role resolution.
 */
export function getAllowedRolesForPortalPath(pathname: string): Role[] | undefined {
  if (pathname.startsWith("/super")) return [ROLES.SUPER_ADMIN];
  if (pathname.startsWith("/manager")) return [ROLES.MANAGER];
  if (pathname.startsWith("/trade")) return [ROLES.TRADE_USER];
  if (pathname.startsWith("/field") || pathname.startsWith("/user")) return [ROLES.FIELD_USER];
  return undefined;
}

/**
 * Role for sidebar/topbar when the pathname is not in the exact page meta map
 * (e.g. `/manager/users/:id/edit`). Never falls back from Manager → Field on
 * unmapped manager routes.
 */
export function resolvePortalRoleFromPathname(pathname: string): Role {
  const allowed = getAllowedRolesForPortalPath(pathname);
  if (allowed?.length === 1) return allowed[0];
  return ROLES.FIELD_USER;
}
