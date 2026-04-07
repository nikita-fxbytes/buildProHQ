import { apiClient } from "@/services/apiClient";

type ApiEnvelope<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export const filtersApi = {
  async saveFilter(body: { categoryId?: string; categoryName?: string; optionsCsv: string }): Promise<void> {
    await apiClient.post<ApiEnvelope<{ message: string }>>("/v1/filters", body);
  },

  async quickAddLevel(name: string): Promise<void> {
    await apiClient.post<ApiEnvelope<{ message: string }>>("/v1/filters/levels", { name });
  },

  async quickAddTrade(name: string): Promise<void> {
    await apiClient.post<ApiEnvelope<{ message: string }>>("/v1/filters/trades", { name });
  },

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete<ApiEnvelope<{ message: string }>>(`/v1/filters/categories/${encodeURIComponent(id)}`);
  },

  async deleteOption(id: string): Promise<void> {
    await apiClient.delete<ApiEnvelope<{ message: string }>>(`/v1/filters/options/${encodeURIComponent(id)}`);
  },
};

