import axios from "axios";
import { MESSAGES } from "@/constants/messages";

type ApiErrorPayload = {
  message?: string;
  error?: {
    code?: string;
    details?: unknown[];
  };
};

export class AppApiError extends Error {
  readonly statusCode?: number;
  readonly code?: string;
  readonly details?: string[];

  constructor(message: string, options?: { statusCode?: number; code?: string; details?: string[] }) {
    super(message);
    this.name = "AppApiError";
    this.statusCode = options?.statusCode;
    this.code = options?.code;
    this.details = options?.details;
  }
}

/**
 * Maps Axios/API errors to a user-facing string. Prefer backend `message` when present.
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorPayload | undefined;
    if (
      payload &&
      typeof payload === "object" &&
      typeof payload.message === "string" &&
      payload.message.trim().length > 0
    ) {
      return payload.message;
    }
    if (error.code === "ECONNABORTED") return MESSAGES.common.timeoutError;
    if (error.code === "ERR_NETWORK") {
      return MESSAGES.common.networkError;
    }
    const statusCode = error.response?.status;
    if (statusCode === 401) return MESSAGES.common.unauthorized;
    if (statusCode === 403) return MESSAGES.common.forbidden;
    if (statusCode === 404) return MESSAGES.common.notFound;
    if (statusCode && statusCode >= 500) return MESSAGES.common.serverError;
    return fallback;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

export function normalizeApiError(
  error: unknown,
  fallback: string = MESSAGES.common.somethingWrong,
): AppApiError {
  if (error instanceof AppApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as ApiErrorPayload | undefined;
    const details =
      payload?.error?.details?.map((detail) => String(detail)).filter(Boolean) ?? undefined;
    return new AppApiError(getApiErrorMessage(error, fallback), {
      statusCode: error.response?.status,
      code: payload?.error?.code,
      details,
    });
  }

  if (error instanceof Error) {
    return new AppApiError(error.message || fallback);
  }

  return new AppApiError(fallback);
}
