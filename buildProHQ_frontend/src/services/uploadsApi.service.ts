import { apiClient } from "@/services/apiClient";

type ApiEnvelope<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type UploadImageResult = {
  fileUrl: string;
  fileName: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
};

export const uploadsApi = {
  async uploadImage(file: File): Promise<UploadImageResult> {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await apiClient.post<ApiEnvelope<UploadImageResult>>(
      "/v1/files/upload",
      formData,
    );
    return data.data;
  },
};
