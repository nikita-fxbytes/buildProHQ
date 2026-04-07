import type { Role } from "@/constants/roles";

export type SortDirection = "asc" | "desc" | null;

export type User = {
  id: string | number;
  name: string;
  email: string;
  role: "User" | "Trade" | "Management";
  initials: string;
  avatarUrl?: string;
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

/** Field portal completed table row (API-backed UUID id). */
export type FieldCompletedTaskRow = {
  id: string;
  level: string;
  trade: string;
  desc: string;
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
  /** Reserved for future API aggregate; not populated from list endpoint. */
  openTasks?: number;
};

/** Trade portal — API-backed task row (UUID id). */
export type TradePortalTask = {
  id: string;
  level: string;
  trade: string;
  desc: string;
  days: number;
};

export type TradePortalCompletedTask = {
  id: string;
  level: string;
  trade: string;
  desc: string;
  date: string;
  duration: number;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
