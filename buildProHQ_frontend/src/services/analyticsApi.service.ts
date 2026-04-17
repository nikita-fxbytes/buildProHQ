import { apiClient } from "@/services/apiClient";

type ApiEnvelope<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: unknown;
};

export type TasksAnalyticsRequest = {
  projectId?: string;
  dateRange?: { from?: string; to?: string };
};

export type TasksAnalyticsResponse = {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  filters: Array<{
    filterId: string;
    filterName: string;
    values: Array<{ name: string; count: number }>;
  }>;
};

export const analyticsApi = {
  async tasks(body: TasksAnalyticsRequest): Promise<TasksAnalyticsResponse> {
    const { data } = await apiClient.post<ApiEnvelope<TasksAnalyticsResponse>>("/v1/analytics/tasks", body);
    return data.data;
  },
};

