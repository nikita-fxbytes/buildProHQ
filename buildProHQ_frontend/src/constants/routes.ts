import type { Role } from "@/constants/roles";
import { ROLES } from "@/constants/roles";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login/user",
  LOGIN_USER: "/login/user",
  LOGIN_TRADE: "/login/trade",
  LOGIN_MANAGER: "/login/mgr",
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
} as const;

export const ROLE_HOME_ROUTES: Record<Role, string> = {
  [ROLES.FIELD_USER]: ROUTES.FIELD_TASKS,
  [ROLES.TRADE_USER]: ROUTES.TRADE_TASKS,
  [ROLES.MANAGER]: ROUTES.MANAGER_TASKS,
};
