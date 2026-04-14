import { ApiV1 } from "@/constants/apiEndpoints";
import { apiClient } from "@/services/apiClient";

type ApiEnvelope<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: unknown;
};

export type UserListItem = {
  id: string;
  full_name: string;
  email: string;
  initials: string | null;
  avatar_url?: string | null;
  user_type_code: string;
  user_type_name: string;
  user_status_code: string;
  user_status_name: string;
  last_login_at: string | null;
  created_at: string;
  is_super_admin?: boolean;
  open_tasks_count?: number;
  completed_tasks_count?: number;
  overdue_tasks_count?: number;
};

export type UsersListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type SearchUsersBody = {
  page: number;
  limit: number;
  search?: string;
  role?: "User" | "Trade" | "Management";
  sortBy?: "createdAt" | "name" | "email" | "role" | "tasks" | "lastLoginAt";
  sortOrder?: "asc" | "desc";
};

export type CreateUserPayload = {
  userTypeId: string;
  userStatusId: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  password?: string;
  roleId?: string;
};

export type UpdateUserPayload = Partial<CreateUserPayload>;

export const usersApi = {
  async list(): Promise<UserListItem[]> {
    const { data } = await apiClient.get<ApiEnvelope<UserListItem[]>>(ApiV1.users.list);
    return data.data;
  },

  async search(
    body: SearchUsersBody,
  ): Promise<{ items: UserListItem[]; meta: UsersListMeta }> {
    const { data } = await apiClient.post<ApiEnvelope<UserListItem[]>>(ApiV1.users.list, body);
    return { items: data.data, meta: (data.meta || {}) as UsersListMeta };
  },

  async getById(id: string): Promise<UserListItem> {
    const { data } = await apiClient.get<ApiEnvelope<UserListItem>>(ApiV1.users.one(id));
    return data.data;
  },

  async create(body: CreateUserPayload): Promise<UserListItem> {
    const { data } = await apiClient.post<ApiEnvelope<UserListItem>>(ApiV1.users.create, body);
    return data.data;
  },

  async update(id: string, body: UpdateUserPayload): Promise<UserListItem> {
    const { data } = await apiClient.patch<ApiEnvelope<UserListItem>>(ApiV1.users.one(id), body);
    return data.data;
  },

  async remove(id: string): Promise<{ id: string; deleted: true; message: string }> {
    const { data } = await apiClient.delete<
      ApiEnvelope<{ id: string; deleted: true; message: string }>
    >(ApiV1.users.one(id));
    return data.data;
  },
};
