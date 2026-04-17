"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { MESSAGES } from "@/constants/messages";
import { ROUTES } from "@/constants/routes";
import { TASK_PRIORITY_CODES } from "@/constants/task-form.constants";
import type { LookupItem } from "@/services/lookupsApi.service";
import {
  fieldAddTaskSchema,
  type FieldAddTaskFormValues,
} from "@/schemas/field-add-task.schema";
import {
  fieldAddTaskService,
  type FieldAddTaskLookups,
} from "@/services/fieldAddTask.service";
import { getApiErrorMessage } from "@/services/apiError";
import { appToast } from "@/utils/toast";
import type { UploadItem } from "@/components/common/FormUploadField";
import { revokeBlobUrls } from "@/utils/uploadItems";
import { useTaskDescriptionTools } from "@/hooks/useTaskDescriptionTools";
import { emitTasksChanged } from "@/utils/taskEvents";
import { projectsApi, type MyProjectItem, type ProjectFilterDefinition } from "@/services/projectsApi.service";

export function useFieldAddTaskController() {
  const router = useRouter();
  const [lookups, setLookups] = useState<FieldAddTaskLookups | null>(null);
  const [loadingLookups, setLoadingLookups] = useState(true);
  const [projects, setProjects] = useState<MyProjectItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [photos, setPhotos] = useState<UploadItem[]>([]);
  const [projectFilterDefinitions, setProjectFilterDefinitions] = useState<ProjectFilterDefinition[]>([]);
  const [loadingProjectFilters, setLoadingProjectFilters] = useState(false);
  const prevProjectIdRef = useRef<string | null>(null);

  const form = useForm<FieldAddTaskFormValues>({
    resolver: zodResolver(fieldAddTaskSchema),
    defaultValues: {
      title: "",
      projectId: "",
      description: "",
      taskFilterValues: [],
      priorityId: "",
    },
  });

  const watchedProjectId = form.watch("projectId");

  useEffect(() => {
    const pid = String(watchedProjectId || "").trim();
    const prev = prevProjectIdRef.current;
    if (prev === null) {
      prevProjectIdRef.current = pid || "";
    } else if (prev !== pid) {
      prevProjectIdRef.current = pid;
      form.setValue("taskFilterValues", []);
    }
    if (!pid) {
      setProjectFilterDefinitions([]);
      return;
    }
    let cancelled = false;
    setLoadingProjectFilters(true);
    projectsApi
      .getFilters(pid)
      .then((res) => {
        if (cancelled) return;
        const filters = Array.isArray(res.filters) ? res.filters : [];
        setProjectFilterDefinitions(filters.slice().sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch(() => {
        if (cancelled) return;
        setProjectFilterDefinitions([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingProjectFilters(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedProjectId]);

  const { voiceActive, toggleVoice, onPaste } = useTaskDescriptionTools(form);

  useEffect(() => {
    const load = async () => {
      try {
        const [data, myProjects] = await Promise.all([
          fieldAddTaskService.loadLookups(),
          projectsApi.listMine(),
        ]);
        setLookups(data);
        setProjects(myProjects);
        form.setValue("priorityId", data.defaultPriorityId);
      } catch (e) {
        appToast.error(getApiErrorMessage(e, MESSAGES.task.loadFailed));
      } finally {
        setLoadingLookups(false);
      }
    };
    void load();
  }, [form]);

  const priorityOptions: LookupItem[] = lookups
    ? TASK_PRIORITY_CODES.map((code) =>
        lookups.priorities.find((p) => p.code === code),
      ).filter((p): p is LookupItem => Boolean(p))
    : [];

  const onSubmit = form.handleSubmit(async (values) => {
    if (!lookups) {
      appToast.error(MESSAGES.task.loadFailed);
      return;
    }
    setSubmitting(true);
    try {
      const files = photos
        .filter((p) => p.status !== "toDelete" && p.file)
        .map((p) => p.file as File);
      await fieldAddTaskService.createTaskWithOptionalPhotos(
        values,
        lookups.openStatusId,
        files,
      );
      appToast.success(MESSAGES.task.created);
      emitTasksChanged();
      setPhotos((prev) => {
        revokeBlobUrls(prev);
        return [];
      });
      router.push(ROUTES.FIELD_TASKS);
    } catch (e) {
      const msg =
        e instanceof Error && e.message
          ? e.message
          : getApiErrorMessage(e, MESSAGES.common.saveFailed);
      appToast.error(msg);
    } finally {
      setSubmitting(false);
    }
  });

  const onCancel = () => router.push(ROUTES.FIELD_TASKS);

  return {
    form,
    lookups,
    loadingLookups,
    submitting,
    projects,
    priorityOptions,
    photos,
    setPhotos,
    projectFilterDefinitions,
    loadingProjectFilters,
    voiceActive,
    onSubmit,
    onCancel,
    onPaste,
    toggleVoice,
  };
}
