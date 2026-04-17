"use client";

/**
 * Task form controller: loads lookups, drives react-hook-form, and performs create/update + attachment uploads.
 * Views must remain dumb — all API calls and navigation live here.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MESSAGES } from "@/constants/messages";
import { ROUTES } from "@/constants/routes";
import { appToast } from "@/utils/toast";
import { getApiErrorMessage } from "@/services/apiError";
import { managerAddTaskService, type ManagerAddTaskLookups } from "@/services/managerAddTask.service";
import { projectsApi, type ProjectFilterDefinition } from "@/services/projectsApi.service";
import { usersApi, type UserListItem } from "@/services/usersApi.service";
import { tasksApi, type TaskAttachmentItem } from "@/services/tasksApi.service";
import { taskFormSchema, type TaskFormValues } from "@/schemas/task-form.schema";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { mergeProjectOptionRow, type ProjectOptionRow } from "@/features/tasks/utils/projectAutocompleteOptions";
import type { TaskFormViewProps } from "@/features/tasks/task-form/TaskFormView";
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
  change_reason?: string;
  changed_at?: string;
  changed_by_full_name?: string | null;
  old_status_name?: string | null;
  new_status_name?: string | null;
  metadata?: unknown;
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
    Array<{ id: string; comment: string; created_at: string; created_by_full_name?: string | null }>
  >([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [commentsHasNext, setCommentsHasNext] = useState(false);
  const [commentsLoadingMore, setCommentsLoadingMore] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyHasNext, setHistoryHasNext] = useState(false);
  const [historyLoadingMore, setHistoryLoadingMore] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentFiles, setCommentFiles] = useState<File[]>([]);
  const [taskAssignedUserIds, setTaskAssignedUserIds] = useState<string[]>([]);

  const [projectSearchInput, setProjectSearchInput] = useState("");
  const [selectedProjectLabel, setSelectedProjectLabel] = useState("");
  const [projectOptions, setProjectOptions] = useState<ProjectOptionRow[]>([]);
  const [projectFilterDefinitions, setProjectFilterDefinitions] = useState<ProjectFilterDefinition[]>([]);
  const [loadingProjectFilters, setLoadingProjectFilters] = useState(false);
  const prevProjectIdRef = useRef<string | null>(null);

  const debouncedProjectQuery = useDebouncedValue(projectSearchInput, 350);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      projectId: "",
      taskFilterValues: [],
      priorityId: "",
      dueDate: "",
      assignedToUserIds: [],
    },
  });

  const watchedProjectId = form.watch("projectId");

  const loadProjectFilters = useCallback(
    async (projectId: string) => {
      const pid = String(projectId || "").trim();
      if (!pid) {
        setProjectFilterDefinitions([]);
        return;
      }
      setLoadingProjectFilters(true);
      try {
        const res = await projectsApi.getFilters(pid);
        const filters = Array.isArray(res.filters) ? res.filters : [];
        setProjectFilterDefinitions(
          filters.slice().sort((a, b) => a.name.localeCompare(b.name)),
        );
      } catch {
        setProjectFilterDefinitions([]);
      } finally {
        setLoadingProjectFilters(false);
      }
    },
    [],
  );

  // When project changes: clear selected filters and fetch new options.
  useEffect(() => {
    const pid = String(watchedProjectId || "").trim();
    const prev = prevProjectIdRef.current;
    if (prev === null) {
      prevProjectIdRef.current = pid || "";
      void loadProjectFilters(pid);
      return;
    }
    if (prev !== pid) {
      prevProjectIdRef.current = pid;
      form.setValue("taskFilterValues", []);
    }
    void loadProjectFilters(pid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedProjectId]);

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
        tasksApi.getHistory(editTaskId, { page: 1, limit: 10 }),
        tasksApi.getComments(editTaskId, { page: 1, limit: 10 }),
        tasksApi.listTaskAttachments(editTaskId).catch(() => [] as TaskAttachmentItem[]),
      ]);
      setLookups(lu);
      setUsers(userList);
      setHistory(taskHistory.items as HistoryItem[]);
      setHistoryPage(taskHistory.meta.page);
      setHistoryHasNext(taskHistory.meta.hasNext);
      setComments(taskComments.items);
      setCommentsPage(taskComments.meta.page);
      setCommentsHasNext(taskComments.meta.hasNext);
      setExistingAttachments(att);
      setNewUploadItems([]);
      const assignedIds =
        (task.assigned_to_user_ids as string[] | undefined) ??
        ((task.assigned_to_user_id ? [task.assigned_to_user_id] : []) as string[]);
      setTaskAssignedUserIds(assignedIds);

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
        taskFilterValues: (task.task_filter_selections as TaskFormValues["taskFilterValues"]) ?? [],
        priorityId: (task.priority_id as string) ?? lu.defaultPriorityId,
        dueDate: task.due_at ? String(task.due_at).slice(0, 10) : "",
        assignedToUserIds: assignedIds,
      });
      prevProjectIdRef.current = projectId;
      await loadProjectFilters(projectId);
    } catch (e) {
      appToast.error(getApiErrorMessage(e, MESSAGES.task.loadFailed));
    } finally {
      setLoadingEdit(false);
    }
  }, [form, isEdit, editTaskId, loadProjectFilters]);

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
          priorityId: values.priorityId,
          description: values.description,
          dueAt: values.dueDate?.trim() ? values.dueDate.trim() : null,
          assignedToUserIds: values.assignedToUserIds ?? [],
          taskFilterValues: values.taskFilterValues ?? [],
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
        priorityId: values.priorityId,
        dueAt: values.dueDate ? values.dueDate : null,
        assignedToUserIds: values.assignedToUserIds ?? [],
        taskFilterValues: values.taskFilterValues ?? [],
      });

      setTaskAssignedUserIds(values.assignedToUserIds ?? []);

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
      await tasksApi.addComment(editTaskId, { comment: text, files: commentFiles });
      setCommentText("");
      setCommentFiles([]);
      const [nextComments, nextHistory] = await Promise.all([
        tasksApi.getComments(editTaskId, { page: 1, limit: 10 }),
        tasksApi.getHistory(editTaskId, { page: 1, limit: 10 }),
      ]);
      setComments(nextComments.items);
      setCommentsPage(nextComments.meta.page);
      setCommentsHasNext(nextComments.meta.hasNext);
      setHistory(nextHistory.items as HistoryItem[]);
      setHistoryPage(nextHistory.meta.page);
      setHistoryHasNext(nextHistory.meta.hasNext);
      appToast.success(MESSAGES.task.commentAdded);
    } catch (e) {
      appToast.error(getApiErrorMessage(e, MESSAGES.common.saveFailed));
    }
  };

  const loadMoreComments = async () => {
    if (!isEdit || !isUuidV4(editTaskId) || commentsLoadingMore || !commentsHasNext) return;
    setCommentsLoadingMore(true);
    try {
      const next = await tasksApi.getComments(editTaskId, { page: commentsPage + 1, limit: 10 });
      setComments((prev) => [...prev, ...next.items]);
      setCommentsPage(next.meta.page);
      setCommentsHasNext(next.meta.hasNext);
    } catch {
      /* ignore */
    } finally {
      setCommentsLoadingMore(false);
    }
  };

  const loadMoreHistory = async () => {
    if (!isEdit || !isUuidV4(editTaskId) || historyLoadingMore || !historyHasNext) return;
    setHistoryLoadingMore(true);
    try {
      const next = await tasksApi.getHistory(editTaskId, { page: historyPage + 1, limit: 10 });
      setHistory((prev) => [...prev, ...(next.items as HistoryItem[])]);
      setHistoryPage(next.meta.page);
      setHistoryHasNext(next.meta.hasNext);
    } catch {
      /* ignore */
    } finally {
      setHistoryLoadingMore(false);
    }
  };

  const disabled = (isCreate ? loadingLookups : loadingEdit) || submitting;

  const taskFormProps: TaskFormViewProps = isCreate
    ? {
        form,
        disabled,
        projectMode: "lookup" as const,
        projectLookupOptions,
        projectFilterDefinitions,
        loadingProjectFilters,
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
        projectFilterDefinitions,
        loadingProjectFilters,
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
    commentFiles,
    setCommentFiles,
    addComment,
    loadMoreComments,
    commentsHasNext,
    commentsLoadingMore,
    loadMoreHistory,
    historyHasNext,
    historyLoadingMore,
  };
}
