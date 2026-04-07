import { apiClient } from "./apiClient";
import { normalizeApiError } from "./apiError";
import { MESSAGES } from "@/constants/messages";
import type { SessionUser } from "@/types/domain";
import type { Role } from "@/constants/roles";

type ApiEnvelope<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

type LoginPayload = {
  user: {
    id: string;
    email: string;
    fullName: string;
    role: Role;
    tradeName?: string;
  };
};

export const authService = {
  async login(role: Role, email: string, password: string): Promise<SessionUser> {
    try {
      const { data } = await apiClient.post<ApiEnvelope<LoginPayload>>("/v1/auth/login", {
        email,
        password,
        portalRole: role,
      });
      const user = data.data.user;

      // Defensive check: even if backend enforcement regresses, never persist an auth session
      // when the returned user role does not match the portal the user used for login.
      if (user.role !== role) {
        try {
          await apiClient.post("/v1/auth/logout");
        } catch {
          // Best-effort only; we still want to prevent session persistence.
        }
        throw new Error(MESSAGES.auth.portalUnauthorized);
      }

      return {
        name: user.fullName,
        initials: user.fullName
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase(),
        role: user.role as Role,
        trade: user.tradeName || undefined,
      };
    } catch (error) {
      throw normalizeApiError(error, MESSAGES.auth.loginFailed);
    }
  },

  async me(): Promise<SessionUser> {
    const { data } = await apiClient.get<
      ApiEnvelope<{
        id: string;
        email: string;
        fullName: string;
        role: Role;
        tradeName?: string;
      }>
    >("/v1/auth/me");
    const user = data.data;

    return {
      name: user.fullName,
      initials: user.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase(),
      role: user.role as Role,
      trade: user.tradeName || undefined,
    };
  },

  async logout(): Promise<void> {
    await apiClient.post("/v1/auth/logout");
  },

  async validateInvite(token: string): Promise<void> {
    await apiClient.get("/v1/auth/invite/validate", { params: { token } });
  },

  async acceptInvite(token: string, password: string): Promise<void> {
    await apiClient.post("/v1/auth/invite/accept", { token, password });
  },
};
