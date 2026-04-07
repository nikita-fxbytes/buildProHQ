import { ROLES, type Role } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

/** Icon names supported by AppIcon for portal nav */
export type PortalNavIconName =
  | "actionItems"
  | "addActionItem"
  | "completedItems"
  | "analytics"
  | "manageFilters"
  | "users"
  | "addUser"
  | "assignedTasks"
  | "myCompleted";

export type SidebarBadgeState = {
  openTasks: number;
  completedTasks: number;
  users: number;
  tradeAssigned: number;
  tradeCompleted: number;
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
      {
        href: ROUTES.FIELD_COMPLETED,
        label: "Completed Items",
        icon: "completedItems",
        badge: "completedTasks",
        badgeClass: "blue",
      },
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
      {
        href: ROUTES.TRADE_COMPLETED,
        label: "My Completed",
        icon: "myCompleted",
        badge: "tradeCompleted",
        badgeClass: "blue",
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
      {
        href: ROUTES.MANAGER_COMPLETED,
        label: "Completed Items",
        icon: "completedItems",
        badge: "completedTasks",
        badgeClass: "blue",
      },
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

const SECTIONS_BY_ROLE: Record<Role, PortalNavSectionConfig[]> = {
  [ROLES.FIELD_USER]: FIELD_SECTIONS,
  [ROLES.TRADE_USER]: TRADE_SECTIONS,
  [ROLES.MANAGER]: MANAGER_SECTIONS,
};

export function getPortalNavSections(role: Role): PortalNavSectionConfig[] {
  return SECTIONS_BY_ROLE[role];
}
