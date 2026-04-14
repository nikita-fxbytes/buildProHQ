import { apiClient } from "@/services/apiClient";

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

export const projectsApi = {
  async listMine(): Promise<MyProjectItem[]> {
    const { data } = await apiClient.get<ApiEnvelope<MyProjectItem[]>>("/v1/projects/my");
    return data.data;
  },

  async search(body: SearchProjectsBody): Promise<{ items: ProjectListItem[]; meta: ListProjectsResponseMeta }> {
    const { data } = await apiClient.post<ApiEnvelope<ProjectListItem[]>>("/v1/projects/search", body);
    const meta = (data.meta || {}) as ListProjectsResponseMeta;
    return { items: data.data, meta };
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
    return { items: data.data, meta: (data.meta || {}) as ListProjectMembersMeta };
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
    return { items: data.data, meta: (data.meta || {}) as ListProjectMembersMeta };
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
};

