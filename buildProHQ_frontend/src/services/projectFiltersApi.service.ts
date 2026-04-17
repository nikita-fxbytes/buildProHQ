import { apiClient } from "@/services/apiClient";
import { safeListMeta } from "@/services/pagination";

type ApiEnvelope<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: unknown;
};

export type ProjectFilterDefinitionRow = {
  id: string;
  name: string;
  projectId: string | null;
  projectName?: string | null;
  type: "simple" | "sub_filter";
  hasSubFilters: boolean;
  isMultiSelect: boolean;
  createdAt?: string;
};

export type ProjectFilterDefinitionDetail = {
  id: string;
  name: string;
  projectId: string | null;
  projectIds?: string[];
  hasSubFilters: boolean;
  isMultiSelect: boolean;
  subFilters: Array<{ id: string; name: string }>;
};

export type CreateProjectFilterBody = {
  name: string;
  projectIds: string[];
  hasSubFilters: boolean;
  isMultiSelect?: boolean;
  subFilterNames?: string[];
};

export type UpdateProjectFilterBody = {
  name?: string;
  hasSubFilters?: boolean;
  isMultiSelect?: boolean;
  subFilterNames?: string[];
};

export const projectFiltersApi = {
  async search(body: {
    projectIds?: string[];
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: "createdAt" | "name";
    sortOrder?: "ASC" | "DESC";
  }): Promise<{ items: ProjectFilterDefinitionRow[]; meta: { page: number; limit: number; total: number; totalPages: number } }> {
    const page = Math.max(1, body.page ?? 1);
    const limit = Math.min(100, Math.max(1, body.limit ?? 20));
    const { data } = await apiClient.post<ApiEnvelope<ProjectFilterDefinitionRow[]>>(
      "/v1/project-filters/search",
      {
        ...body,
        page,
        limit,
        sortOrder: body.sortOrder ?? "DESC",
      },
    );
    const meta = safeListMeta(data.meta, { page, limit }) as {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    return { items: Array.isArray(data.data) ? data.data : [], meta };
  },

  async getById(id: string): Promise<ProjectFilterDefinitionDetail> {
    const { data } = await apiClient.get<ApiEnvelope<ProjectFilterDefinitionDetail>>(
      `/v1/project-filters/${encodeURIComponent(id)}`,
    );
    return data.data;
  },

  async create(body: CreateProjectFilterBody): Promise<ProjectFilterDefinitionDetail> {
    const { data } = await apiClient.post<ApiEnvelope<ProjectFilterDefinitionDetail>>("/v1/project-filters", body);
    return data.data;
  },

  async update(id: string, body: UpdateProjectFilterBody): Promise<ProjectFilterDefinitionDetail> {
    const { data } = await apiClient.patch<ApiEnvelope<ProjectFilterDefinitionDetail>>(
      `/v1/project-filters/${encodeURIComponent(id)}`,
      body,
    );
    return data.data;
  },

  async remove(id: string): Promise<{ id: string }> {
    const { data } = await apiClient.delete<ApiEnvelope<{ id: string }>>(`/v1/project-filters/${encodeURIComponent(id)}`);
    return data.data ?? { id };
  },
};
