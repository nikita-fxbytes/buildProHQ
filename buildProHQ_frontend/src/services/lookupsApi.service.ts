import { apiClient } from "@/services/apiClient";

type ApiEnvelope<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: unknown;
};

export type LookupItem = {
  id: string;
  code: string;
  name: string;
  sortOrder?: number;
};

export type UserStatusLookupItem = LookupItem & {
  isActive?: boolean;
};

export type RoleLookupItem = LookupItem & {
  isSystemRole?: boolean;
};

export type FilterCategoryApi = {
  id: string;
  projectId?: string | null;
  code: string;
  name: string;
  isSystemCategory: boolean;
};

export type FilterOptionApi = {
  id: string;
  filterCategoryId: string;
  code: string;
  name: string;
  sortOrder: number;
};

export const lookupsApi = {
  async getTaskPriorities(): Promise<LookupItem[]> {
    const { data } = await apiClient.get<ApiEnvelope<LookupItem[]>>(
      "/v1/lookups/task-priorities",
    );
    return data.data;
  },
  async getTaskStatuses(): Promise<LookupItem[]> {
    const { data } = await apiClient.get<ApiEnvelope<LookupItem[]>>("/v1/lookups/task-statuses");
    return data.data;
  },
  async getUserTypes(): Promise<LookupItem[]> {
    const { data } = await apiClient.get<ApiEnvelope<LookupItem[]>>("/v1/lookups/user-types");
    return data.data;
  },
  async getUserStatuses(): Promise<UserStatusLookupItem[]> {
    const { data } = await apiClient.get<ApiEnvelope<UserStatusLookupItem[]>>(
      "/v1/lookups/user-statuses",
    );
    return data.data;
  },
  async getRoles(): Promise<RoleLookupItem[]> {
    const { data } = await apiClient.get<ApiEnvelope<RoleLookupItem[]>>("/v1/lookups/roles");
    return data.data;
  },
  async getFilterCategories(): Promise<FilterCategoryApi[]> {
    const { data } = await apiClient.get<ApiEnvelope<FilterCategoryApi[]>>(
      "/v1/lookups/filter-categories",
    );
    return data.data;
  },
  async getFilterOptions(filterCategoryId?: string): Promise<FilterOptionApi[]> {
    const url = filterCategoryId
      ? `/v1/lookups/filter-options?filterCategoryId=${encodeURIComponent(filterCategoryId)}`
      : "/v1/lookups/filter-options";
    const { data } = await apiClient.get<ApiEnvelope<FilterOptionApi[]>>(url);
    return data.data;
  },
};
