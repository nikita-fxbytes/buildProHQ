import { ROLES, type Role } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

/** Icon names supported by AppIcon for portal nav */
export type PortalNavIconName =
  | "actionItems"
  | "addActionItem"
  | "superAdmin"
  | "analytics"
  | "manageFilters"
  | "users"
  | "projects"
  | "manager"
  | "addUser"
  | "assignedTasks";

export type SidebarBadgeState = {
  openTasks: number;
  users: number;
  tradeAssigned: number;
};

export type PortalNavItemConfig = {
  href: string;
  label: string;
  icon: PortalNavIconName;
  /** Which badge field to show; omit for no badge */
  badge?: keyof SidebarBadgeState;
  badgeClass?: "blue";
};

export type PortalNavSectionConfig = {
  id: string;
  /** Section header label (e.g. Main, Management) */
  label: string;
  items: PortalNavItemConfig[];
};

const FIELD_SECTIONS: PortalNavSectionConfig[] = [
  {
    id: "main",
    label: "Main",
    items: [
      {
        href: ROUTES.FIELD_TASKS,
        label: "Action Items",
        icon: "actionItems",
        badge: "openTasks",
      },
      { href: ROUTES.FIELD_ADD_TASK, label: "Add Action Item", icon: "addActionItem" },
    ],
  },
];

const TRADE_SECTIONS: PortalNavSectionConfig[] = [
  {
    id: "main",
    label: "Main",
    items: [
      {
        href: ROUTES.TRADE_TASKS,
        label: "My Assigned Tasks",
        icon: "assignedTasks",
        badge: "tradeAssigned",
      },
    ],
  },
];

const MANAGER_SECTIONS: PortalNavSectionConfig[] = [
  {
    id: "main",
    label: "Main",
    items: [
      {
        href: ROUTES.MANAGER_TASKS,
        label: "Action Items",
        icon: "actionItems",
        badge: "openTasks",
      },
      { href: ROUTES.MANAGER_ADD_TASK, label: "Add Action Item", icon: "addActionItem" },
    ],
  },
  {
    id: "management",
    label: "Management",
    items: [
      { href: ROUTES.MANAGER_ANALYTICS, label: "Analytics", icon: "analytics" },
      { href: ROUTES.MANAGER_FILTERS, label: "Manage Filters", icon: "manageFilters" },
      { href: ROUTES.MANAGER_USERS, label: "Users", icon: "users", badge: "users" },
    ],
  },
];

const SUPER_ADMIN_SECTIONS: PortalNavSectionConfig[] = [
  {
    id: "main",
    label: "Main",
    items: [
      { href: ROUTES.SUPER_DASHBOARD, label: "Super Dashboard", icon: "superAdmin" },
      { href: ROUTES.SUPER_MANAGEMENT_DASHBOARD, label: "Management Dashboard", icon: "manager" },
      { href: ROUTES.SUPER_ANALYTICS, label: "Analytics", icon: "analytics" },
    ],
  },
  {
    id: "administration",
    label: "Administration",
    items: [
      { href: ROUTES.SUPER_PROJECTS, label: "Projects", icon: "projects" },
      { href: ROUTES.SUPER_TASKS, label: "All Action Items", icon: "actionItems", badge: "openTasks" },
      { href: ROUTES.SUPER_USERS, label: "All Users", icon: "users", badge: "users" },
      { href: ROUTES.SUPER_FILTERS, label: "Filters", icon: "manageFilters" },
    ],
  },
];

const SECTIONS_BY_ROLE: Record<Role, PortalNavSectionConfig[]> = {
  [ROLES.FIELD_USER]: FIELD_SECTIONS,
  [ROLES.TRADE_USER]: TRADE_SECTIONS,
  [ROLES.MANAGER]: MANAGER_SECTIONS,
  [ROLES.SUPER_ADMIN]: SUPER_ADMIN_SECTIONS,
};

export function getPortalNavSections(role: Role): PortalNavSectionConfig[] {
  return SECTIONS_BY_ROLE[role];
}
