import type { SessionUser } from "@/types/domain";

const SESSION_KEY = "buildprohq.session.user";

export const sessionService = {
  setUser(user: SessionUser) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },
  getUser(): SessionUser | null {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SessionUser;
    } catch {
      return null;
    }
  },
  clearUser() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(SESSION_KEY);
  },
};

