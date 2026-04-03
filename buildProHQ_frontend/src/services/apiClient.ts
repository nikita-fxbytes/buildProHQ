import axios from "axios";
import { APP } from "@/constants/app";
import { MESSAGES } from "@/constants/messages";
import { normalizeApiError } from "@/services/apiError";

export const apiClient = axios.create({
  baseURL: APP.BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Ensure multipart uploads work correctly.
 * If we force "application/json" on a FormData request, Axios won't set the
 * required multipart boundary and the backend won't receive the file.
 */
apiClient.interceptors.request.use((config) => {
  const isFormData =
    typeof FormData !== "undefined" && config.data instanceof FormData;

  if (isFormData) {
    // Let Axios/browser set `multipart/form-data; boundary=...`
    if (config.headers) {
      delete (config.headers as Record<string, unknown>)["Content-Type"];
      delete (config.headers as Record<string, unknown>)["content-type"];
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeApiError(error, MESSAGES.common.somethingWrong)),
);

