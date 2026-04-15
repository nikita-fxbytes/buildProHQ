import { ApiV1 } from "@/constants/apiEndpoints";
import { apiClient } from "@/services/apiClient";
import { resolvePublicUrl } from "@/utils/urls";
import { safeListMeta } from "@/services/pagination";

type ApiEnvelope<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: unknown;
};

export type TaskListItem = {
  id: string;
  title?: string | null;
  project_id?: string | null;
  project_name?: string | null;
  description: string;
  days_open: number;
  created_at: string;
  opened_at: string;
  closed_at: string | null;
  assigned_to_user_id: string | null;
  assigned_to_user_ids?: string[] | null;
  assigned_users?: Array<{ id: string; fullName: string; role?: string | null }> | null;
  created_by_user_id: string;
  created_by_initials?: string | null;
  created_by_full_name?: string | null;
  status_id: string;
  status_code: string;
  status_name: string;
  trade_name: string | null;
  level_name: string | null;
  priority_id: string | null;
  priority_code: string | null;
  priority_name: string | null;
  due_at?: string | null;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
};

export type PagedMeta = {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
};

export const safeMeta = (meta: unknown): PagedMeta => {
  const m = (meta ?? {}) as Partial<PagedMeta>;
  return {
    page: typeof m.page === "number" && m.page > 0 ? m.page : 1,
    limit: typeof m.limit === "number" && m.limit > 0 ? m.limit : 10,
    total: typeof m.total === "number" && m.total >= 0 ? m.total : 0,
    hasNext: typeof m.hasNext === "boolean" ? m.hasNext : false,
  };
};

export type ListTasksResponseMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type OpenTasksFilters = {
  projectIds?: string[];
  tradeIds?: string[];
  levelIds?: string[];
  createdByUserIds?: string[];
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
  sortBy?:
    | "createdAt"
    | "title"
    | "projectName"
    | "daysOpen"
    | "level"
    | "trade"
    | "priority"
    | "description"
    | "user"
    | "assignedUser"
    // Back-compat: older key
    | "assignedUserName";
  sortOrder?: "asc" | "desc";
  filters?: OpenTasksFilters;
};

export type CompletedTasksFilters = {
  tradeIds?: string[];
  levelIds?: string[];
  completedByUserIds?: string[];
};

export type ListCompletedTasksBody = {
  page: number;
  limit: number;
  search?: string;
  sortBy?: "level" | "trade" | "user" | "description" | "date" | "duration";
  sortOrder?: "asc" | "desc";
  filters?: CompletedTasksFilters;
};

export type CompletedTaskListItem = {
  id: string;
  description: string;
  closed_at: string;
  days_open: number;
  trade_name: string | null;
  level_name: string | null;
  completed_by_user_id: string | null;
  completed_by_initials?: string | null;
  completed_by_full_name?: string | null;
};

export type TaskStats = {
  totalOpen: number;
  total?: number;
  totalCompleted: number;
  urgent: number;
  overdue: number;
  overdue10: number;
  midRange7to10: number;
  fresh0to6: number;
  tradesActive: number;
  /** Optional: simplified stats used by HTML cards */
  open?: number;
  today?: number;
  totalTasks?: number;
  completed?: number;
  overdueDue?: number;
};

export type ManagerAnalytics = {
  openTasks: number;
  completedTotal: number;
  avgCompletionDays: number;
  byTrade: Array<{ trade: string; count: number }>;
  byLevel: Array<{ level: string; count: number }>;
  overdueTop: Array<{ daysOpen: number; level: string | null; description: string; user: string | null }>;
  overdueDueCount?: number;
  overdueDueTop?: Array<{
    id: string;
    title?: string | null;
    description: string;
    dueAt: string;
    level?: string | null;
    project?: string | null;
    status?: string | null;
  }>;
  byUser: Array<{ user: string; completed: number }>;
};

export type RecentTaskItem = {
  id: string;
  title?: string | null;
  description: string;
  created_at: string;
  project_name?: string | null;
  level_name?: string | null;
  trade_name?: string | null;
  status_name?: string | null;
};

export type CreateTaskPayload = {
  title: string;
  projectId: string;
  statusId: string;
  priorityId?: string;
  levelId: string;
  tradeId: string;
  description: string;
  notes?: string;
  assignedToUserId?: string | null;
  assignedToUserIds?: string[];
  dueAt?: string | null;
};

export type TaskDetailResponse = {
  id: string;
  title?: string | null;
  description?: string;
  status_id?: string;
  status_name?: string | null;
  status_code?: string | null;
  project_id?: string | null;
  project_name?: string | null;
  priority_id?: string | null;
  priority_name?: string | null;
  level_id?: string | null;
  trade_id?: string | null;
  assigned_to_user_id?: string | null;
  assigned_to_user_ids?: string[];
  due_at?: string | null;
  [key: string]: unknown;
};

export type AllowedTaskStatusName = "Open" | "In Progress" | "Completed";

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
  async getStats(params?: {
    search?: string;
    filters?: OpenTasksFilters;
    scope?: "open" | "all";
  }): Promise<TaskStats> {
    const q = params ?? {};
    const f = q.filters ?? {};
    const qp = new URLSearchParams();
    if (q.search) qp.set("search", q.search);
    if (q.scope) qp.set("scope", q.scope);
    const pushCsv = (key: string, arr?: string[]) => {
      const v = Array.isArray(arr) ? arr.filter(Boolean) : [];
      if (v.length) qp.set(key, v.join(","));
    };
    pushCsv("filters.projectIds", f.projectIds);
    pushCsv("filters.tradeIds", f.tradeIds);
    pushCsv("filters.levelIds", f.levelIds);
    pushCsv("filters.createdByUserIds", f.createdByUserIds);
    pushCsv("filters.statusIds", f.statusIds);
    pushCsv("filters.priorityIds", f.priorityIds);

    const url = qp.toString() ? `${ApiV1.tasks.stats}?${qp.toString()}` : ApiV1.tasks.stats;
    const { data } = await apiClient.get<ApiEnvelope<unknown>>(url, {
      headers: { "Cache-Control": "no-cache" },
    });
    const raw = (data as any)?.data ?? {};
    return {
      totalOpen: Number((raw as any)?.totalOpen ?? (raw as any)?.open ?? 0),
      total: Number((raw as any)?.total ?? 0),
      totalCompleted: Number((raw as any)?.totalCompleted ?? (raw as any)?.completed ?? 0),
      urgent: Number((raw as any)?.urgent ?? 0),
      overdue: Number((raw as any)?.overdue ?? 0),
      overdue10: Number((raw as any)?.overdue10 ?? 0),
      midRange7to10: Number((raw as any)?.midRange7to10 ?? 0),
      fresh0to6: Number((raw as any)?.fresh0to6 ?? 0),
      tradesActive: Number((raw as any)?.tradesActive ?? 0),
      open: Number((raw as any)?.open ?? (raw as any)?.totalOpen ?? 0),
      today: Number((raw as any)?.today ?? 0),
      totalTasks: Number((raw as any)?.total ?? (raw as any)?.totalTasks ?? 0),
      completed: Number((raw as any)?.completed ?? (raw as any)?.totalCompleted ?? 0),
      overdueDue: Number((raw as any)?.overdueDue ?? (raw as any)?.overdue ?? 0),
    };
  },

  async getAnalytics(): Promise<ManagerAnalytics> {
    const { data } = await apiClient.get<ApiEnvelope<ManagerAnalytics>>(ApiV1.tasks.analytics);
    return data.data;
  },

  async listRecentTasks(limit = 6): Promise<RecentTaskItem[]> {
    const { data } = await apiClient.get<ApiEnvelope<RecentTaskItem[]>>(`/v1/tasks/recent?limit=${limit}`);
    return Array.isArray(data.data) ? data.data : [];
  },

  async listAll(
    body: ListOpenTasksBody,
  ): Promise<{ items: TaskListItem[]; meta: ListTasksResponseMeta }> {
    const { data } = await apiClient.post<ApiEnvelope<TaskListItem[]>>("/v1/tasks/search", body);
    const meta = safeListMeta(data.meta, { page: body.page, limit: body.limit }) as ListTasksResponseMeta;
    return { items: Array.isArray(data.data) ? data.data : [], meta };
  },

  async listOpen(
    body: ListOpenTasksBody,
  ): Promise<{ items: TaskListItem[]; meta: ListTasksResponseMeta }> {
    const { data } = await apiClient.post<ApiEnvelope<TaskListItem[]>>(ApiV1.tasks.open, body);
    const meta = safeListMeta(data.meta, { page: body.page, limit: body.limit }) as ListTasksResponseMeta;
    return { items: Array.isArray(data.data) ? data.data : [], meta };
  },

  async listCompleted(
    body: ListCompletedTasksBody,
  ): Promise<{ items: CompletedTaskListItem[]; meta: ListTasksResponseMeta }> {
    const { data } = await apiClient.post<ApiEnvelope<CompletedTaskListItem[]>>(
      "/v1/tasks/completed",
      body,
    );
    const meta = safeListMeta(data.meta, { page: body.page, limit: body.limit }) as ListTasksResponseMeta;
    return { items: Array.isArray(data.data) ? data.data : [], meta };
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

  async getById(id: string): Promise<TaskDetailResponse> {
    const { data } = await apiClient.get<ApiEnvelope<TaskDetailResponse>>(`/v1/tasks/${id}`);
    return data.data;
  },

  async update(
    id: string,
    body: {
      title?: string;
      projectId?: string;
      description?: string;
      levelId?: string;
      tradeId?: string;
      priorityId?: string;
      dueAt?: string | null;
      assignedToUserId?: string | null;
      assignedToUserIds?: string[];
      notes?: string;
    },
  ): Promise<TaskDetailResponse> {
    const { data } = await apiClient.patch<ApiEnvelope<TaskDetailResponse>>(`/v1/tasks/${id}`, body);
    return data.data;
  },

  async updateStatus(id: string, body: { status: AllowedTaskStatusName }): Promise<TaskDetailResponse> {
    const { data } = await apiClient.patch<ApiEnvelope<TaskDetailResponse>>(`/v1/tasks/${id}/status`, body);
    return data.data;
  },

  async assign(id: string, body: { assigneeUserId: string; notes?: string }): Promise<TaskDetailResponse> {
    const { data } = await apiClient.post<ApiEnvelope<TaskDetailResponse>>(`/v1/tasks/${id}/assign`, body);
    return data.data;
  },

  async addComment(
    id: string,
    body: { comment: string; files?: File[] },
  ): Promise<{ comment: string; attachments: Array<{ url: string; name: string }> }> {
    const formData = new FormData();
    formData.append("comment", body.comment);
    (Array.isArray(body.files) ? body.files : []).forEach((f) => formData.append("files", f));
    const { data } = await apiClient.post<ApiEnvelope<{ comment: string; attachments: Array<{ url: string; name: string }> }>>(
      `/v1/tasks/${id}/comments`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return data.data;
  },

  async getComments(
    id: string,
    opts?: { page?: number; limit?: number },
  ): Promise<{
    items: Array<{
      id: string;
      task_id: string;
      comment: string;
      created_at: string;
      created_by_full_name?: string | null;
      attachments?: Array<{ url: string; name: string }>;
    }>;
    meta: PagedMeta;
  }> {
    const page = opts?.page ?? 1;
    const limit = opts?.limit ?? 10;
    const { data } = await apiClient.get<
      ApiEnvelope<{
        data: Array<{
          id: string;
          task_id: string;
          comment: string;
          created_at: string;
          created_by_full_name?: string | null;
          attachments?: Array<{ url: string; name: string }>;
        }>;
        meta: PagedMeta;
      }>
    >(`/v1/tasks/${id}/comments?page=${page}&limit=${limit}`);
    // ResponseInterceptor can place meta at top-level, and data can be either:
    // - an array (data: items, meta: {...})
    // - an object (data: { data: items, meta: {...} })
    const payload = (data as any)?.data;
    const topMeta = safeMeta((data as any)?.meta);
    const nestedMeta = safeMeta((payload as any)?.meta);
    const items =
      Array.isArray(payload)
        ? payload
        : Array.isArray((payload as any)?.data)
          ? (payload as any).data
          : [];
    const meta = topMeta.total || topMeta.page !== 1 || topMeta.limit !== 10 || topMeta.hasNext ? topMeta : nestedMeta;
    return { items, meta };
  },

  async getHistory(
    id: string,
    opts?: { page?: number; limit?: number },
  ): Promise<{
    items: Array<{ id: string; change_reason?: string; changed_at?: string; changed_by_full_name?: string | null; old_status_name?: string | null; new_status_name?: string | null; metadata?: unknown; notes?: string | null }>;
    meta: PagedMeta;
  }> {
    const page = opts?.page ?? 1;
    const limit = opts?.limit ?? 10;
    const { data } = await apiClient.get<
      ApiEnvelope<{
        data: Array<{ id: string; change_reason?: string; changed_at?: string; changed_by_full_name?: string | null; old_status_name?: string | null; new_status_name?: string | null; metadata?: unknown; notes?: string | null }>;
        meta: PagedMeta;
      }>
    >(`/v1/tasks/${id}/history?page=${page}&limit=${limit}`);
    const payload = (data as any)?.data;
    const topMeta = safeMeta((data as any)?.meta);
    const nestedMeta = safeMeta((payload as any)?.meta);
    const items =
      Array.isArray(payload)
        ? payload
        : Array.isArray((payload as any)?.data)
          ? (payload as any).data
          : [];
    const meta = topMeta.total || topMeta.page !== 1 || topMeta.limit !== 10 || topMeta.hasNext ? topMeta : nestedMeta;
    return { items, meta };
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
    return data.data.map((a) => ({ ...a, fileUrl: resolvePublicUrl(a.fileUrl) }));
  },

  async completeTask(
    taskId: string,
    body?: { notes?: string; photos?: string[]; gps?: string },
  ): Promise<TaskDetailResponse> {
    const { data } = await apiClient.post<ApiEnvelope<TaskDetailResponse>>(
      `/v1/tasks/${taskId}/complete`,
      body ?? {},
    );
    return data.data;
  },
};

