import { apiClient } from "@/services/apiClient";

type ApiEnvelope<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: unknown;
};

export type NotificationItem = {
  id: string;
  title?: string | null;
  body?: string | null;
  type?: string | null;
  isRead: boolean;
  readAt?: string | null;
  createdAt: string;
};

export type NotificationsMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ListNotificationsResponse = {
  items: NotificationItem[];
  meta: NotificationsMeta;
  message: string;
};

export const notificationsApi = {
  async list(params?: { page?: number; limit?: number; isRead?: "true" | "false" }) {
    const qp = new URLSearchParams();
    if (params?.page) qp.set("page", String(params.page));
    if (params?.limit) qp.set("limit", String(params.limit));
    if (params?.isRead) qp.set("isRead", params.isRead);
    const url = qp.size ? `/v1/notifications?${qp.toString()}` : "/v1/notifications";
    const { data } = await apiClient.get<ApiEnvelope<ListNotificationsResponse>>(url);
    return data.data;
  },

  async markAllRead(): Promise<{ success: true; message: string }> {
    const { data } = await apiClient.patch<ApiEnvelope<{ success: true; message: string }>>(
      "/v1/notifications/read-all",
    );
    return data.data;
  },

  async markRead(id: string): Promise<{ id: string; isRead: true; message: string }> {
    const { data } = await apiClient.patch<
      ApiEnvelope<{ id: string; isRead: true; message: string }>
    >(`/v1/notifications/${id}/read`);
    return data.data;
  },
};

