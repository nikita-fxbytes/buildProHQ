import type { Role } from "@/constants/roles";

export type SortDirection = "asc" | "desc" | null;

export type User = {
  id: number;
  name: string;
  email: string;
  role: "User" | "Trade" | "Management";
  initials: string;
  trade?: string;
  password?: string | null;
};

export type Task = {
  id: number;
  level: string;
  trade: string;
  desc: string;
  days: number;
  user: string;
};

export type CompletedTask = Task & {
  date: string;
  duration: number;
};

export type FilterCategory = {
  name: string;
  subs: string[];
};

export type FilterState = {
  trade: string[];
  level: string[];
  user?: string[];
};

export type PaginationState = {
  page: number;
  pageSize: number;
};

export type SessionUser = {
  name: string;
  initials: string;
  role: Role;
  trade?: string;
};

export type ManagerUsersListQuery = {
  search: string;
  role: "" | User["role"];
  page: number;
  pageSize: number;
};

export type ManagerUsersListItem = User & {
  openTasks: number;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
