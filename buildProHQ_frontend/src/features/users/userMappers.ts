import type { UserListItem } from "@/services/usersApi.service";
import type { LookupItem, RoleLookupItem, UserStatusLookupItem } from "@/services/lookupsApi.service";
import type { ManagerUsersListItem } from "@/types/domain";
import type { UserFormValues } from "@/schemas/user.schema";

export function mapUserTypeCodeToFormRole(
  code: string,
): "User" | "Trade" | "Management" {
  if (code === "trade_user") return "Trade";
  if (code === "management") return "Management";
  return "User";
}

export function mapListItemToManagerRow(item: UserListItem): ManagerUsersListItem {
  return {
    id: item.id,
    name: item.full_name,
    email: item.email,
    initials: item.initials ?? "—",
    avatarUrl: item.avatar_url ?? undefined,
    role: mapUserTypeCodeToFormRole(item.user_type_code),
    openTasks: typeof item.open_tasks_count === "number" ? item.open_tasks_count : undefined,
  };
}

export function matchesManagerUserRoleFilter(
  item: UserListItem,
  roleFilter: "" | "User" | "Trade" | "Management",
): boolean {
  if (!roleFilter) return true;
  const r = mapUserTypeCodeToFormRole(item.user_type_code);
  return r === roleFilter;
}

export type UserCreateLookups = {
  types: LookupItem[];
  statuses: UserStatusLookupItem[];
  roles: RoleLookupItem[];
};

export function resolveUserCreateIds(
  role: UserFormValues["role"],
  lookups: UserCreateLookups,
): { userTypeId: string; userStatusId: string; roleId?: string } | null {
  const active = lookups.statuses.find((s) => s.code === "active");
  if (!active) return null;
  const typeCode =
    role === "User" ? "field_user" : role === "Trade" ? "trade_user" : "management";
  const type = lookups.types.find((t) => t.code === typeCode);
  if (!type) return null;
  const rbacCode =
    role === "Management" ? "manager_admin" : role === "Trade" ? "trade_user" : "field_user";
  const rbac = lookups.roles.find((r) => r.code === rbacCode);
  return {
    userTypeId: type.id,
    userStatusId: active.id,
    roleId: rbac?.id,
  };
}
