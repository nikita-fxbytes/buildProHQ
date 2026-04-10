import type { Role } from "@/constants/roles";
import { ROLES } from "@/constants/roles";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login/user",
  LOGIN_USER: "/login/user",
  LOGIN_TRADE: "/login/trade",
  LOGIN_MANAGER: "/login/mgr",
  LOGIN_SUPER: "/login/super",
  FIELD_TASKS: "/field/tasks",
  FIELD_ADD_TASK: "/field/add-task",
  FIELD_COMPLETED: "/field/completed",
  USER_TASKS: "/user/tasks",
  USER_ADD_TASK: "/user/tasks/add",
  USER_COMPLETED: "/user/completed",
  TRADE_TASKS: "/trade/tasks",
  TRADE_COMPLETED: "/trade/completed",
  MANAGER_TASKS: "/manager/tasks",
  MANAGER_ADD_TASK: "/manager/tasks/add",
  MANAGER_COMPLETED: "/manager/completed",
  MANAGER_ANALYTICS: "/manager/analytics",
  MANAGER_FILTERS: "/manager/filters",
  MANAGER_USERS: "/manager/users",
  MANAGER_ADD_USER: "/manager/users/add",
  SUPER_DASHBOARD: "/super/dashboard",
  SUPER_PROJECTS: "/super/projects",
  SUPER_TASKS: "/super/tasks",
  SUPER_COMPLETED: "/super/completed",
  SUPER_ANALYTICS: "/super/analytics",
  SUPER_USERS: "/super/users",
  SUPER_FILTERS: "/super/filters",
  SUPER_MANAGEMENT_DASHBOARD: "/super/management-dashboard",
  SUPER_ADD_USER: "/super/users/add",
  SUPER_CREATE_TASK: "/super/tasks/create",
  SUPER_FILTER_NEW: "/super/filters/new",
} as const;

export const ROLE_HOME_ROUTES: Record<Role, string> = {
  [ROLES.FIELD_USER]: ROUTES.FIELD_TASKS,
  [ROLES.TRADE_USER]: ROUTES.TRADE_TASKS,
  [ROLES.MANAGER]: ROUTES.MANAGER_TASKS,
  [ROLES.SUPER_ADMIN]: ROUTES.SUPER_DASHBOARD,
};
