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

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => Promise.reject(normalizeApiError(error, MESSAGES.common.somethingWrong)),
);

