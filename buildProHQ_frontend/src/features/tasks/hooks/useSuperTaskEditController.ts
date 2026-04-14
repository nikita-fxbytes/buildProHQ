"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MESSAGES } from "@/constants/messages";
import { ROUTES } from "@/constants/routes";
import { appToast } from "@/utils/toast";
import { getApiErrorMessage } from "@/services/apiError";
import { managerAddTaskService } from "@/services/managerAddTask.service";
import { projectsApi, type MyProjectItem } from "@/services/projectsApi.service";
import { usersApi, type UserListItem } from "@/services/usersApi.service";
import { tasksApi } from "@/services/tasksApi.service";
import { htmlToPlainText } from "@/utils/richText";
import { z } from "zod";

const editTaskSchema = z.object({
  description: z.string().superRefine((val, ctx) => {
    const plain = htmlToPlainText(val);
    if (!plain) ctx.addIssue({ code: "custom", message: MESSAGES.validation.taskDescriptionRequired });
    else if (plain.length < 3) ctx.addIssue({ code: "custom", message: MESSAGES.validation.taskDescriptionMin });
  }),
  levelId: z.string().min(1, MESSAGES.validation.selectLevel).uuid(MESSAGES.validation.selectLevel),
  tradeId: z.string().min(1, MESSAGES.validation.selectTrade).uuid(MESSAGES.validation.selectTrade),
  priorityId: z.string().min(1, MESSAGES.validation.selectPriority).uuid(MESSAGES.validation.selectPriority),
  dueDate: z.string().optional(), // yyyy-mm-dd from <input type="date">
  assignedToUserId: z.string().uuid().optional().nullable(),
});

export type SuperTaskEditFormValues = z.infer<typeof editTaskSchema>;

type TaskHistoryItem = {
  id: string;
  changeReason?: string | null;
  changedAt?: string | null;
  notes?: string | null;
};

/**
 * Loads task detail + lookups and drives the Edit Task full-page form.
 */
export function useSuperTaskEditController(opts: { taskId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [lookups, setLookups] = useState<Awaited<ReturnType<typeof managerAddTaskService.loadLookups>> | null>(null);
  const [projects, setProjects] = useState<MyProjectItem[]>([]);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [history, setHistory] = useState<TaskHistoryItem[]>([]);
  const [comments, setComments] = useState<Array<{ id: string; comment: string; createdAt: string; createdBy: string }>>(
    [],
  );
  const [commentText, setCommentText] = useState("");
  const [taskTitle, setTaskTitle] = useState("Edit Task");
  const [taskAssignedUserId, setTaskAssignedUserId] = useState<string | null>(null);

  const form = useForm<SuperTaskEditFormValues>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: {
      description: "",
      levelId: "",
      tradeId: "",
      priorityId: "",
      dueDate: "",
      assignedToUserId: null,
    },
  });

  const userOptions = useMemo(() => {
    return users.map((u) => ({
      value: u.id,
      label: `${u.full_name} (${u.user_type_name})`,
    }));
  }, [users]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [lu, myProjects, userList, task, taskHistory, taskComments] = await Promise.all([
        managerAddTaskService.loadLookups(),
        projectsApi.listMine(),
        usersApi.list(),
        tasksApi.getById(opts.taskId),
        tasksApi.getHistory(opts.taskId),
        tasksApi.getComments(opts.taskId),
      ]);
      setLookups(lu);
      setProjects(myProjects);
      setUsers(userList);
      setHistory(taskHistory as TaskHistoryItem[]);
      setComments(taskComments);

      setTaskTitle("Edit Task");
      setTaskAssignedUserId(task.assigned_to_user_id ?? null);

      // Prefill based on API detail response (snake_case from backend)
      form.reset({
        description: (task.description as string) ?? "",
        levelId: (task.level_id as string) ?? "",
        tradeId: (task.trade_id as string) ?? "",
        priorityId: (task.priority_id as string) ?? lu.defaultPriorityId,
        dueDate: task.due_at ? String(task.due_at).slice(0, 10) : "",
        assignedToUserId: task.assigned_to_user_id ?? null,
      });
    } catch (e) {
      appToast.error(getApiErrorMessage(e, MESSAGES.task.loadFailed));
    } finally {
      setLoading(false);
    }
  }, [form, opts.taskId]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const onCancel = () => router.push(ROUTES.SUPER_TASKS);

  const onSave = form.handleSubmit(async (values) => {
    if (!lookups) return;
    setSubmitting(true);
    try {
      await tasksApi.update(opts.taskId, {
        description: values.description,
        levelId: values.levelId,
        tradeId: values.tradeId,
        priorityId: values.priorityId,
        dueAt: values.dueDate ? values.dueDate : null,
        assignedToUserId: values.assignedToUserId ?? null,
      });

      // Keep assign/reassign behavior consistent with backend assign endpoint.
      // If user changed assignment, call /assign; if cleared, update already sent null.
      if (values.assignedToUserId && values.assignedToUserId !== taskAssignedUserId) {
        await tasksApi.assign(opts.taskId, { assigneeUserId: values.assignedToUserId });
        setTaskAssignedUserId(values.assignedToUserId);
      }
      if (!values.assignedToUserId && taskAssignedUserId) {
        setTaskAssignedUserId(null);
      }

      appToast.success("Task updated.");
      router.push(ROUTES.SUPER_TASKS);
    } catch (e) {
      appToast.error(getApiErrorMessage(e, MESSAGES.common.saveFailed));
    } finally {
      setSubmitting(false);
    }
  });

  const addComment = async () => {
    const text = commentText.trim();
    if (!text) return;
    try {
      await tasksApi.addComment(opts.taskId, { comment: text });
      setCommentText("");
      const [nextComments, nextHistory] = await Promise.all([
        tasksApi.getComments(opts.taskId),
        tasksApi.getHistory(opts.taskId),
      ]);
      setComments(nextComments);
      setHistory(nextHistory as TaskHistoryItem[]);
      appToast.success("Comment added.");
    } catch (e) {
      appToast.error(getApiErrorMessage(e, MESSAGES.common.saveFailed));
    }
  };

  return {
    title: taskTitle,
    loading,
    submitting,
    form,
    projects: projects.map((p) => ({ id: p.id, name: p.name })),
    levels: lookups?.levels ?? [],
    trades: lookups?.trades ?? [],
    priorities: lookups?.priorities ?? [],
    userOptions,
    history,
    comments,
    commentText,
    setCommentText,
    addComment,
    onSave,
    onCancel,
  };
}

