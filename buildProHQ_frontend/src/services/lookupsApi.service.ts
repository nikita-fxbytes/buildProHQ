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

export const lookupsApi = {
  async getTrades(): Promise<LookupItem[]> {
    const { data } = await apiClient.get<ApiEnvelope<LookupItem[]>>("/v1/lookups/trades");
    return data.data;
  },
  async getLevels(): Promise<LookupItem[]> {
    const { data } = await apiClient.get<ApiEnvelope<LookupItem[]>>("/v1/lookups/levels");
    return data.data;
  },
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
};

