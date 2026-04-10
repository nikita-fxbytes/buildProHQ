export const ROLES = {
  FIELD_USER: "field_user",
  TRADE_USER: "trade_user",
  MANAGER: "manager",
  SUPER_ADMIN: "super_admin",
} as const;

export const ROLE_LABELS: Record<Role, string> = {
  field_user: "Field User",
  trade_user: "Trade User",
  manager: "Manager / Admin",
  super_admin: "Super Admin",
};

export type Role = (typeof ROLES)[keyof typeof ROLES];
