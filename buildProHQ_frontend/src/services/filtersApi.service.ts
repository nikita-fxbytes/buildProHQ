import { apiClient } from "@/services/apiClient";

type ApiEnvelope<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type SaveFilterCategoryPayload = {
  filterCategoryId?: string;
  filterCategoryName?: string;
  subFilterNames?: string[];
  projectIds?: string[];
};

export const filtersApi = {
  async saveFilter(body: SaveFilterCategoryPayload): Promise<void> {
    await apiClient.post<ApiEnvelope<{ message: string }>>("/v1/filters", body);
  },

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete<ApiEnvelope<{ message: string }>>(`/v1/filters/categories/${encodeURIComponent(id)}`);
  },

  async deleteOption(id: string): Promise<void> {
    await apiClient.delete<ApiEnvelope<{ message: string }>>(`/v1/filters/options/${encodeURIComponent(id)}`);
  },
};
