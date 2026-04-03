import { apiClient } from "@/services/apiClient";

type ApiEnvelope<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: unknown;
};

export type TaskListItem = {
  id: string;
  description: string;
  days_open: number;
  created_at: string;
  opened_at: string;
  closed_at: string | null;
  assigned_to_user_id: string | null;
  created_by_user_id: string;
  status_id: string;
  status_code: string;
  status_name: string;
  trade_name: string | null;
  level_name: string | null;
  priority_id: string | null;
  priority_code: string | null;
  priority_name: string | null;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
};

export type ListTasksResponseMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type OpenTasksFilters = {
  tradeIds?: string[];
  levelIds?: string[];
  statusIds?: string[];
  priorityIds?: string[];
  dateRange?: {
    openedFrom?: string;
    openedTo?: string;
  };
};

export type ListOpenTasksBody = {
  page: number;
  limit: number;
  search?: string;
  sortBy?: "createdAt" | "daysOpen" | "level" | "trade" | "priority" | "description";
  sortOrder?: "asc" | "desc";
  filters?: OpenTasksFilters;
};

export type ListCompletedTasksBody = {
  page: number;
  limit: number;
  search?: string;
  sortBy?: "closedAt" | "daysOpen" | "level" | "trade" | "description";
  sortOrder?: "asc" | "desc";
  filters?: OpenTasksFilters;
};

export type TaskStats = {
  totalOpen: number;
  totalCompleted: number;
  urgent: number;
  overdue: number;
  overdue10: number;
  midRange7to10: number;
  fresh0to6: number;
  tradesActive: number;
};

export type CreateTaskPayload = {
  statusId: string;
  priorityId?: string;
  levelId: string;
  tradeId: string;
  description: string;
  notes?: string;
};

export type TaskDetailResponse = {
  id: string;
  description?: string;
  status_id?: string;
  [key: string]: unknown;
};

export type AddTaskAttachmentPayload = {
  fileUrl: string;
  fileName: string;
  fileType: string;
  mimeType?: string;
  fileSize: number;
  isBefore?: boolean;
  isAfter?: boolean;
};

/** Matches Attachment entity fields returned by GET /v1/tasks/:id/attachments */
export type TaskAttachmentItem = {
  id: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  mimeType?: string | null;
  isBefore: boolean;
  isAfter: boolean;
};

export const tasksApi = {
  async getStats(): Promise<TaskStats> {
    const { data } = await apiClient.get<ApiEnvelope<TaskStats>>("/v1/tasks/stats");
    return data.data;
  },

  async listOpen(
    body: ListOpenTasksBody,
  ): Promise<{ items: TaskListItem[]; meta: ListTasksResponseMeta }> {
    const { data } = await apiClient.post<ApiEnvelope<TaskListItem[]>>(
      "/v1/tasks/open",
      body,
    );
    const meta = (data.meta || {}) as ListTasksResponseMeta;
    return { items: data.data, meta };
  },

  async listCompleted(
    body: ListCompletedTasksBody,
  ): Promise<{ items: TaskListItem[]; meta: ListTasksResponseMeta }> {
    const { data } = await apiClient.post<ApiEnvelope<TaskListItem[]>>(
      "/v1/tasks/completed",
      body,
    );
    const meta = (data.meta || {}) as ListTasksResponseMeta;
    return { items: data.data, meta };
  },

  async bulkComplete(ids: string[]): Promise<Array<{ id: string; status: "success" | "error"; message?: string }>> {
    const { data } = await apiClient.post<
      ApiEnvelope<Array<{ id: string; status: "success" | "error"; message?: string }>>
    >("/v1/tasks/bulk-complete", { ids });
    return data.data;
  },

  async bulkDelete(ids: string[]): Promise<Array<{ id: string; status: "success" | "error"; message?: string }>> {
    const { data } = await apiClient.delete<
      ApiEnvelope<Array<{ id: string; status: "success" | "error"; message?: string }>>
    >("/v1/tasks/bulk-delete", { data: { ids } });
    return data.data;
  },

  async deleteOne(id: string): Promise<{ id: string; deleted: true }> {
    const { data } = await apiClient.delete<ApiEnvelope<{ id: string; deleted: true }>>(
      `/v1/tasks/${id}`,
    );
    return data.data;
  },

  async createTask(body: CreateTaskPayload): Promise<TaskDetailResponse> {
    const { data } = await apiClient.post<ApiEnvelope<TaskDetailResponse>>("/v1/tasks", body);
    return data.data;
  },

  async addAttachment(taskId: string, payload: AddTaskAttachmentPayload): Promise<{ id: string }> {
    const { data } = await apiClient.post<ApiEnvelope<{ id: string }>>(
      `/v1/tasks/${taskId}/attachments`,
      payload,
    );
    return data.data;
  },

  async listTaskAttachments(taskId: string): Promise<TaskAttachmentItem[]> {
    const { data } = await apiClient.get<ApiEnvelope<TaskAttachmentItem[]>>(
      `/v1/tasks/${taskId}/attachments`,
    );
    return data.data;
  },
};

