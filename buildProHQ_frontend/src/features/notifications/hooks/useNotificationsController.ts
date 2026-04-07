"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { notificationsApi, type NotificationItem } from "@/services/notificationsApi.service";
import { appToast } from "@/utils/toast";
import { MESSAGES } from "@/constants/messages";

export function useNotificationsController() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      // Keep it lightweight for topbar panel.
      const res = await notificationsApi.list({ page: 1, limit: 25 });
      setItems(res.items);
      setUnreadCount(res.items.filter((n) => !n.isRead).length);
    } catch {
      appToast.error(MESSAGES.common.somethingWrong);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load on mount so badge dot is accurate.
    void load();
  }, [load]);

  const markAllRead = useCallback(async () => {
    try {
      await notificationsApi.markAllRead();
      await load();
    } catch {
      appToast.error(MESSAGES.common.saveFailed);
    }
  }, [load]);

  const markRead = useCallback(
    async (id: string) => {
      try {
        await notificationsApi.markRead(id);
        setItems((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt: n.readAt ?? new Date().toISOString() } : n)),
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch {
        appToast.error(MESSAGES.common.saveFailed);
      }
    },
    [],
  );

  const hasUnread = unreadCount > 0;

  return useMemo(
    () => ({
      open,
      setOpen,
      loading,
      items,
      unreadCount,
      hasUnread,
      reload: load,
      markAllRead,
      markRead,
    }),
    [hasUnread, items, load, loading, markAllRead, markRead, open, unreadCount],
  );
}

