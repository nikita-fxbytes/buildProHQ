import { apiClient } from "@/services/apiClient";
import { safeListMeta } from "@/services/pagination";

type ApiEnvelope<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: unknown;
};

export type ListProjectsResponseMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ProjectListItem = {
  id: string;
  code: string;
  name: string;
  createdAt: string;
  membersTotal?: number;
  membersManagers?: number;
  membersTrades?: number;
  membersField?: number;
};

export type MyProjectItem = {
  id: string;
  code: string;
  name: string;
  createdAt?: string;
};

export type SearchProjectsBody = {
  page: number;
  limit: number;
  search?: string;
  sortBy?: "createdAt" | "name" | "code" | "members";
  sortOrder?: "asc" | "desc";
};

export type CreateProjectBody = {
  name: string;
  code?: string;
};

export type ProjectMemberListItem = {
  membershipId: string;
  projectId: string;
  userId: string;
  fullName: string;
  email: string;
  initials: string | null;
  avatarUrl: string | null;
  roleCode: string;
  projectRole: string | null;
  assignedAt: string;
};

export type ListProjectMembersMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type SearchProjectMembersBody = {
  page: number;
  limit: number;
  search?: string;
  role?: "manager" | "trade_user" | "field_user";
};

export type AssignProjectMemberBody = {
  userId?: string;
  userIds?: string[];
  projectRole?: string;
};

/** Dynamic filter definitions for a project (task form). */
export type ProjectFilterDefinition = {
  id: string;
  name: string;
  hasSubFilters: boolean;
  isMultiSelect: boolean;
  subFilters: Array<{ id: string; name: string }>;
};

export const projectsApi = {
  async listMine(): Promise<MyProjectItem[]> {
    const { data } = await apiClient.get<ApiEnvelope<MyProjectItem[]>>("/v1/projects/my");
    return data.data;
  },

  async search(body: SearchProjectsBody): Promise<{ items: ProjectListItem[]; meta: ListProjectsResponseMeta }> {
    const safeLimit = Math.min(body.limit || 20, 100);
    const safePage = Math.max(1, body.page || 1);
    const { data } = await apiClient.post<ApiEnvelope<ProjectListItem[]>>("/v1/projects/search", {
      ...body,
      page: safePage,
      limit: safeLimit,
    });
    const meta = safeListMeta(data.meta) as ListProjectsResponseMeta;
    return { items: Array.isArray(data.data) ? data.data : [], meta };
  },

  async create(body: CreateProjectBody): Promise<ProjectListItem> {
    const { data } = await apiClient.post<ApiEnvelope<ProjectListItem>>("/v1/projects", body);
    return data.data;
  },

  async listMembers(
    projectId: string,
    body: SearchProjectMembersBody,
  ): Promise<{ items: ProjectMemberListItem[]; meta: ListProjectMembersMeta }> {
    const safeLimit = Math.min(body.limit || 10, 100);
    const safePage = Math.max(1, body.page || 1);
    const { data } = await apiClient.post<ApiEnvelope<ProjectMemberListItem[]>>(
      `/v1/projects/${projectId}/members`,
      {
        ...body,
        page: safePage,
        limit: safeLimit,
      },
    );
    return { items: Array.isArray(data.data) ? data.data : [], meta: safeListMeta(data.meta, { page: safePage, limit: safeLimit }) as ListProjectMembersMeta };
  },

  async listMembersGet(
    projectId: string,
    params: SearchProjectMembersBody,
  ): Promise<{ items: ProjectMemberListItem[]; meta: ListProjectMembersMeta }> {
    const safeLimit = Math.min(params.limit || 10, 100);
    const safePage = Math.max(1, params.page || 1);
    const { data } = await apiClient.get<ApiEnvelope<ProjectMemberListItem[]>>(
      `/v1/projects/${projectId}/members`,
      { params: { ...params, page: safePage, limit: safeLimit } },
    );
    return { items: Array.isArray(data.data) ? data.data : [], meta: safeListMeta(data.meta, { page: safePage, limit: safeLimit }) as ListProjectMembersMeta };
  },

  async assignMember(projectId: string, body: AssignProjectMemberBody): Promise<{ message: string }> {
    const { data } = await apiClient.post<ApiEnvelope<{ message: string }>>(
      `/v1/projects/${projectId}/members/assign`,
      body,
    );
    return data.data;
  },

  async unassignMember(projectId: string, userId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiEnvelope<{ message: string }>>(
      `/v1/projects/${projectId}/members/${userId}`,
    );
    return data.data;
  },

  async remove(projectId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete<ApiEnvelope<{ message: string }>>(`/v1/projects/${projectId}`);
    return data.data;
  },

  async getFilters(projectId: string): Promise<{ filters: ProjectFilterDefinition[] }> {
    const { data } = await apiClient.get<ApiEnvelope<{ filters: ProjectFilterDefinition[] }>>(
      `/v1/projects/${encodeURIComponent(projectId)}/filters`,
    );
    return data.data ?? { filters: [] };
  },
};
