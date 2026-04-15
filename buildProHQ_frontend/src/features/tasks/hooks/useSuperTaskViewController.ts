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
  changeReason?: string | null;
  changedAt?: string | null;
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
    Array<{ id: string; comment: string; createdAt: string; createdBy: string }>
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
        tasksApi.getComments(opts.taskId),
        tasksApi.getHistory(opts.taskId),
        usersApi.list(),
        tasksApi.listTaskAttachments(opts.taskId).catch(() => []),
      ]);
      setTask(t);
      setComments(c);
      setHistory(h as HistoryItem[]);
      setUsers(u);
      setAttachments(att);
    } catch (e) {
      appToast.error(getApiErrorMessage(e, MESSAGES.task.loadFailed));
      setTask(null);
    } finally {
      setLoading(false);
    }
  }, [opts.taskId]);

  useEffect(() => {
    void load();
  }, [load]);

  const assigneeLabel = useMemo(() => {
    const id = task?.assigned_to_user_id as string | null | undefined;
    if (!id) return "—";
    const u = users.find((x) => x.id === id);
    return u ? `${u.full_name} (${u.user_type_name})` : "—";
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
    assigneeLabel,
    daysToDeadline,
    deadlineLabel,
    onBack,
    onEdit,
  };
}
