/**
 * Central path segments for REST calls (relative to apiClient baseURL).
 * TODO: migrate remaining services to use these to avoid string drift.
 */
export const ApiV1 = {
  tasks: {
    stats: "/v1/tasks/stats",
    analytics: "/v1/tasks/analytics",
    open: "/v1/tasks/open",
    completed: "/v1/tasks/completed",
    bulkComplete: "/v1/tasks/bulk-complete",
    bulkDelete: "/v1/tasks/bulk-delete",
    one: (id: string) => `/v1/tasks/${id}`,
    attachments: (id: string) => `/v1/tasks/${id}/attachments`,
    complete: (id: string) => `/v1/tasks/${id}/complete`,
  },
  users: {
    list: "/v1/users",
    create: "/v1/users/create",
    one: (id: string) => `/v1/users/${id}`,
  },
  projects: {
    my: "/v1/projects/my",
    search: "/v1/projects/search",
    create: "/v1/projects",
    membersSearch: (projectId: string) => `/v1/projects/${projectId}/members/search`,
    members: (projectId: string, userId: string) =>
      `/v1/projects/${projectId}/members/${userId}`,
  },
} as const;
