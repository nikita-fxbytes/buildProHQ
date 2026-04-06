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
  user_type_code: string;
  user_type_name: string;
  user_status_code: string;
  user_status_name: string;
  last_login_at: string | null;
  created_at: string;
};

export const usersApi = {
  async list(): Promise<UserListItem[]> {
    const { data } = await apiClient.get<ApiEnvelope<UserListItem[]>>("/v1/users");
    return data.data;
  },
};

