"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { authService } from "@/services/auth.service";
import { sessionService } from "@/services/session.service";
import type { SessionUser } from "@/types/domain";
import type { Role } from "@/constants/roles";
import { MESSAGES } from "@/constants/messages";
import { ROLE_HOME_ROUTES, ROUTES } from "@/constants/routes";
import { appToast } from "@/utils/toast";

interface AuthContextType {
  user: SessionUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  /** Resolves true on success; false on handled failure (toast already shown). Does not throw for invalid credentials or portal mismatch. */
  login: (role: Role, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const localUser = sessionService.getUser();
      if (localUser) {
        setUser(localUser);
      }
      // Avoid calling protected APIs on public routes unless we already have a local session.
      // This prevents noisy/expected 401s during the unauthenticated login flow.
      const isPublicAuthRoute =
        pathname.startsWith("/login") || pathname.startsWith("/set-password");

      if (!isPublicAuthRoute || localUser) {
        const currentUser = await authService.me();
        setUser(currentUser);
        sessionService.setUser(currentUser);
      }
    } catch {
      setUser(null);
      sessionService.clearUser();
    } finally {
      setIsLoading(false);
    }
  }, [pathname]);

  const login = async (role: Role, email: string, password: string) => {
    try {
      const sessionUser = await authService.login(role, email, password);
      setUser(sessionUser);
      sessionService.setUser(sessionUser);
      const home = ROLE_HOME_ROUTES[sessionUser.role];
      router.replace(home);
      appToast.success(MESSAGES.auth.loginSuccess, { autoClose: 1800 });
      return true;
    } catch (error) {
      // Ensure no partial session is kept on login failures.
      setUser(null);
      sessionService.clearUser();

      const message =
        error instanceof Error ? error.message : MESSAGES.auth.loginFailed;
      appToast.error(message);

      // If backend rejected the login (e.g. portal mismatch), clear any server cookie too.
      const statusCode =
        error && typeof (error as { statusCode?: unknown }).statusCode === "number"
          ? (error as { statusCode: number }).statusCode
          : undefined;

      if (statusCode === 401 || statusCode === 403) {
        try {
          await authService.logout();
        } catch {
          // Best-effort only.
        }
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      sessionService.clearUser();
      router.push(ROUTES.LOGIN);
      appToast.info(MESSAGES.auth.logoutSuccess);
    } catch (error) {
      appToast.error(MESSAGES.common.somethingWrong);
    }
  };

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, checkSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
