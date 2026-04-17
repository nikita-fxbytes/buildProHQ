"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MESSAGES } from "@/constants/messages";
import { ROUTES, taskRoutes } from "@/constants/routes";
import { getApiErrorMessage } from "@/services/apiError";
import { tasksApi, type TaskAttachmentItem, type TaskDetailResponse } from "@/services/tasksApi.service";
import { usersApi, type UserListItem } from "@/services/usersApi.service";
import { appToast } from "@/utils/toast";
import { computeDaysToDeadline, formatDeadlineDate } from "@/utils/taskDeadline";
import { isUuidV4 } from "@/utils/taskRouteParams";

type HistoryItem = {
  id: string;
  change_reason?: string;
  changed_at?: string;
  changed_by_full_name?: string | null;
  old_status_name?: string | null;
  new_status_name?: string | null;
  metadata?: unknown;
  notes?: string | null;
};

/**
 * Read-only task detail for /super/tasks/view/:taskId (drawer layout as full page).
 */
export function useSuperTaskViewController(opts: { taskId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<TaskDetailResponse | null>(null);
  const [comments, setComments] = useState<
    Array<{ id: string; comment: string; created_at: string; created_by_full_name?: string | null }>
  >([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [attachments, setAttachments] = useState<TaskAttachmentItem[]>([]);

  const load = useCallback(async () => {
    if (!isUuidV4(opts.taskId)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [t, c, h, u, att] = await Promise.all([
        tasksApi.getById(opts.taskId),
        tasksApi.getComments(opts.taskId, { page: 1, limit: 10 }),
        tasksApi.getHistory(opts.taskId, { page: 1, limit: 10 }),
        usersApi.list(),
        tasksApi.listTaskAttachments(opts.taskId),
      ]);
      setTask(t);
      setComments(c.items);
      setHistory(h.items as HistoryItem[]);
      setUsers(u);
      setAttachments(att);
    } catch (e) {
      appToast.error(getApiErrorMessage(e, MESSAGES.task.loadFailed));
      setTask(null);
      setAttachments([]);
    } finally {
      setLoading(false);
    }
  }, [opts.taskId]);

  useEffect(() => {
    void load();
  }, [load]);

  const assignedUsersLabel = useMemo(() => {
    const ids =
      (task?.assigned_to_user_ids as string[] | undefined) ??
      ((task?.assigned_to_user_id ? [task.assigned_to_user_id] : []) as string[]);
    if (!ids.length) return "—";
    return ids
      .map((id) => users.find((u) => u.id === id))
      .filter(Boolean)
      .map((u) => `${u!.full_name} (${u!.user_type_name})`)
      .join(", ");
  }, [task, users]);

  const daysToDeadline = useMemo(() => computeDaysToDeadline(task?.due_at ?? null), [task?.due_at]);
  const deadlineLabel = useMemo(() => formatDeadlineDate(task?.due_at ?? null), [task?.due_at]);

  const onBack = () => router.push(ROUTES.SUPER_TASKS);
  const onEdit = () => {
    if (!isUuidV4(opts.taskId)) return;
    router.push(taskRoutes.superEdit(opts.taskId));
  };

  return {
    loading,
    task,
    comments,
    history,
    attachments,
    assigneeLabel: assignedUsersLabel,
    daysToDeadline,
    deadlineLabel,
    onBack,
    onEdit,
  };
}
