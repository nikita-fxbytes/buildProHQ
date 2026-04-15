"use client";

/**
 * Task form controller: loads lookups, drives react-hook-form, and performs create/update + attachment uploads.
 * Views must remain dumb — all API calls and navigation live here.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MESSAGES } from "@/constants/messages";
import { ROUTES } from "@/constants/routes";
import { appToast } from "@/utils/toast";
import { getApiErrorMessage } from "@/services/apiError";
import { managerAddTaskService, type ManagerAddTaskLookups } from "@/services/managerAddTask.service";
import { projectsApi } from "@/services/projectsApi.service";
import { usersApi, type UserListItem } from "@/services/usersApi.service";
import { tasksApi, type TaskAttachmentItem } from "@/services/tasksApi.service";
import { taskFormSchema, type TaskFormValues } from "@/schemas/task-form.schema";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { mergeProjectOptionRow, type ProjectOptionRow } from "@/features/tasks/utils/projectAutocompleteOptions";
import { isUuidV4 } from "@/utils/taskRouteParams";
import type { UploadItem } from "@/components/common/FileUpload";
import { revokeBlobUrls } from "@/utils/uploadItems";
import { emitTasksChanged } from "@/utils/taskEvents";
import { uploadBeforePhotosForTask } from "@/services/taskCreateWithPhotos.service";
import { validateBeforePhotos } from "@/schemas/field-add-task.schema";

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;

export type TaskFormControllerOpts =
  | { mode: "create"; portal: "manager" | "super" }
  | { mode: "edit"; taskId: string };

type HistoryItem = {
  id: string;
  changeReason?: string | null;
  changedAt?: string | null;
  notes?: string | null;
};

export function useTaskFormController(opts: TaskFormControllerOpts) {
  const router = useRouter();
  const isCreate = opts.mode === "create";
  const isEdit = opts.mode === "edit";
  const editTaskId = opts.mode === "edit" ? opts.taskId : "";
  const createPortal = opts.mode === "create" ? opts.portal : "manager";

  const [lookups, setLookups] = useState<ManagerAddTaskLookups | null>(null);
  const [loadingLookups, setLoadingLookups] = useState(() => opts.mode === "create");
  const [loadingEdit, setLoadingEdit] = useState(() => opts.mode === "edit");
  const [submitting, setSubmitting] = useState(false);
  const [projects, setProjects] = useState<Awaited<ReturnType<typeof projectsApi.listMine>>>([]);
  const [users, setUsers] = useState<UserListItem[]>([]);

  const [photos, setPhotos] = useState<UploadItem[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<TaskAttachmentItem[]>([]);
  const [newUploadItems, setNewUploadItems] = useState<UploadItem[]>([]);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [comments, setComments] = useState<
    Array<{ id: string; comment: string; createdAt: string; createdBy: string }>
  >([]);
  const [commentText, setCommentText] = useState("");
  const [taskAssignedUserId, setTaskAssignedUserId] = useState<string | null>(null);

  const [projectSearchInput, setProjectSearchInput] = useState("");
  const [selectedProjectLabel, setSelectedProjectLabel] = useState("");
  const [projectOptions, setProjectOptions] = useState<ProjectOptionRow[]>([]);

  const debouncedProjectQuery = useDebouncedValue(projectSearchInput, 350);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      projectId: "",
      levelId: "",
      tradeId: "",
      priorityId: "",
      dueDate: "",
      assignedToUserId: null,
    },
  });

  const watchedProjectId = form.watch("projectId");

  const userOptions = useMemo(
    () =>
      users.map((u) => ({
        value: u.id,
        label: `${u.full_name} (${u.user_type_name})`,
      })),
    [users],
  );

  /** Create: load lookups + projects + users. */
  useEffect(() => {
    if (!isCreate) return;
    const load = async () => {
      try {
        const [data, myProjects, userList] = await Promise.all([
          managerAddTaskService.loadLookups(),
          projectsApi.listMine(),
          usersApi.list(),
        ]);
        setLookups(data);
        setProjects(myProjects);
        setUsers(userList);
        form.setValue("priorityId", data.defaultPriorityId);
      } catch (e) {
        appToast.error(getApiErrorMessage(e, MESSAGES.task.loadFailed));
      } finally {
        setLoadingLookups(false);
      }
    };
    void load();
  }, [form, isCreate]);

  /** Edit: load task detail, lookups, attachments, comments, history. */
  const loadEdit = useCallback(async () => {
    if (!isEdit || !isUuidV4(editTaskId)) {
      setLoadingEdit(false);
      return;
    }
    setLoadingEdit(true);
    try {
      const [lu, myProjects, userList, task, taskHistory, taskComments, att] = await Promise.all([
        managerAddTaskService.loadLookups(),
        projectsApi.listMine(),
        usersApi.list(),
        tasksApi.getById(editTaskId),
        tasksApi.getHistory(editTaskId),
        tasksApi.getComments(editTaskId),
        tasksApi.listTaskAttachments(editTaskId).catch(() => [] as TaskAttachmentItem[]),
      ]);
      setLookups(lu);
      setUsers(userList);
      setHistory(taskHistory as HistoryItem[]);
      setComments(taskComments);
      setExistingAttachments(att);
      setNewUploadItems([]);
      setTaskAssignedUserId(task.assigned_to_user_id ?? null);

      const projectId = (task.project_id as string) ?? "";
      const projectName = (task.project_name as string) ?? "";
      const baseRows = myProjects.map((p) => ({ value: p.id, label: p.name }));
      setProjectOptions(mergeProjectOptionRow(baseRows, projectId || null, projectName || null));
      setSelectedProjectLabel(projectName);
      setProjectSearchInput(projectName);

      form.reset({
        title: (task.title as string) ?? "",
        description: (task.description as string) ?? "",
        projectId,
        levelId: (task.level_id as string) ?? "",
        tradeId: (task.trade_id as string) ?? "",
        priorityId: (task.priority_id as string) ?? lu.defaultPriorityId,
        dueDate: task.due_at ? String(task.due_at).slice(0, 10) : "",
        assignedToUserId: task.assigned_to_user_id ?? null,
      });
    } catch (e) {
      appToast.error(getApiErrorMessage(e, MESSAGES.task.loadFailed));
    } finally {
      setLoadingEdit(false);
    }
  }, [form, isEdit, editTaskId]);

  useEffect(() => {
    void loadEdit();
  }, [loadEdit]);

  /** Debounced project search for edit mode. */
  useEffect(() => {
    if (!isEdit || loadingEdit) return;
    let cancelled = false;
    const run = async () => {
      const q = debouncedProjectQuery.trim();
      try {
        if (!q) {
          const mine = await projectsApi.listMine();
          if (cancelled) return;
          const rows = mine.map((p) => ({ value: p.id, label: p.name }));
          setProjectOptions(mergeProjectOptionRow(rows, watchedProjectId || null, selectedProjectLabel || null));
          return;
        }
        const { items } = await projectsApi.search({ page: 1, limit: 30, search: q, sortBy: "name", sortOrder: "asc" });
        if (cancelled) return;
        const rows = items.map((p) => ({ value: p.id, label: p.name }));
        setProjectOptions(mergeProjectOptionRow(rows, watchedProjectId || null, selectedProjectLabel || null));
      } catch {
        /* keep options */
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [debouncedProjectQuery, isEdit, loadingEdit, watchedProjectId, selectedProjectLabel]);

  const projectLookupOptions = useMemo(
    () => projects.map((p) => ({ id: p.id, code: p.code, name: p.name })),
    [projects],
  );

  const onCancel = () => {
    if (isCreate) {
      router.push(createPortal === "super" ? ROUTES.SUPER_TASKS : ROUTES.MANAGER_TASKS);
    } else {
      router.push(ROUTES.SUPER_TASKS);
    }
  };

  const onSubmitCreate = form.handleSubmit(async (values) => {
    if (!lookups) {
      appToast.error(MESSAGES.task.loadFailed);
      return;
    }
    setSubmitting(true);
    try {
      const files = photos.filter((p) => p.status !== "toDelete" && p.file).map((p) => p.file as File);
      await managerAddTaskService.createTaskWithOptionalPhotos(
        {
          title: values.title.trim(),
          projectId: values.projectId,
          statusId: lookups.openStatusId,
          levelId: values.levelId,
          tradeId: values.tradeId,
          priorityId: values.priorityId,
          description: values.description,
          dueAt: values.dueDate?.trim() ? values.dueDate.trim() : null,
          assignedToUserId:
            values.assignedToUserId && values.assignedToUserId !== "" ? values.assignedToUserId : null,
        },
        files,
      );
      appToast.success(MESSAGES.task.created);
      setPhotos((prev) => {
        revokeBlobUrls(prev);
        return [];
      });
      emitTasksChanged();
      router.push(createPortal === "super" ? ROUTES.SUPER_TASKS : ROUTES.MANAGER_TASKS);
    } catch (e) {
      const msg =
        e instanceof Error && e.message ? e.message : getApiErrorMessage(e, MESSAGES.common.saveFailed);
      appToast.error(msg);
    } finally {
      setSubmitting(false);
    }
  });

  const onSubmitEdit = form.handleSubmit(async (values) => {
    if (!isEdit || !isUuidV4(editTaskId) || !lookups) return;
    const files = newUploadItems.filter((p) => p.status !== "toDelete" && p.file).map((p) => p.file as File);
    const photoErr = validateBeforePhotos(files, MAX_PHOTO_BYTES);
    if (photoErr) {
      appToast.error(photoErr);
      return;
    }
    setSubmitting(true);
    try {
      await tasksApi.update(editTaskId, {
        title: values.title.trim(),
        projectId: values.projectId,
        description: values.description,
        levelId: values.levelId,
        tradeId: values.tradeId,
        priorityId: values.priorityId,
        dueAt: values.dueDate ? values.dueDate : null,
        assignedToUserId: values.assignedToUserId ?? null,
      });

      if (values.assignedToUserId && values.assignedToUserId !== taskAssignedUserId) {
        await tasksApi.assign(editTaskId, { assigneeUserId: values.assignedToUserId });
        setTaskAssignedUserId(values.assignedToUserId);
      }
      if (!values.assignedToUserId && taskAssignedUserId) {
        setTaskAssignedUserId(null);
      }

      if (files.length) {
        await uploadBeforePhotosForTask(editTaskId, files);
        setNewUploadItems([]);
        const next = await tasksApi.listTaskAttachments(editTaskId).catch(() => []);
        setExistingAttachments(next);
      }

      appToast.success(MESSAGES.task.updated);
      router.push(ROUTES.SUPER_TASKS);
    } catch (e) {
      appToast.error(getApiErrorMessage(e, MESSAGES.common.saveFailed));
    } finally {
      setSubmitting(false);
    }
  });

  const addComment = async () => {
    if (!isEdit || !isUuidV4(editTaskId)) return;
    const text = commentText.trim();
    if (!text) return;
    try {
      await tasksApi.addComment(editTaskId, { comment: text });
      setCommentText("");
      const [nextComments, nextHistory] = await Promise.all([
        tasksApi.getComments(editTaskId),
        tasksApi.getHistory(editTaskId),
      ]);
      setComments(nextComments);
      setHistory(nextHistory as HistoryItem[]);
      appToast.success(MESSAGES.task.commentAdded);
    } catch (e) {
      appToast.error(getApiErrorMessage(e, MESSAGES.common.saveFailed));
    }
  };

  const disabled = (isCreate ? loadingLookups : loadingEdit) || submitting;

  const taskFormProps = isCreate
    ? {
        form,
        disabled,
        projectMode: "lookup" as const,
        projectLookupOptions,
        levels: lookups?.levels ?? [],
        trades: lookups?.trades ?? [],
        priorities: lookups?.priorities ?? [],
        userOptions,
        files: { mode: "create" as const, items: photos, onChange: setPhotos },
      }
    : {
        form,
        disabled,
        projectMode: "search" as const,
        projectSearch: {
          options: projectOptions,
          input: projectSearchInput,
          setInput: setProjectSearchInput,
          setSelectedLabel: setSelectedProjectLabel,
        },
        levels: lookups?.levels ?? [],
        trades: lookups?.trades ?? [],
        priorities: lookups?.priorities ?? [],
        userOptions,
        files: {
          mode: "edit" as const,
          existing: existingAttachments,
          newItems: newUploadItems,
          onNewChange: setNewUploadItems,
        },
      };

  return {
    mode: opts.mode,
    form,
    disabled,
    submitting,
    loading: isCreate ? loadingLookups : loadingEdit,
    onSubmit: isCreate ? onSubmitCreate : onSubmitEdit,
    onCancel,
    taskFormProps,
    comments,
    history,
    commentText,
    setCommentText,
    addComment,
  };
}
