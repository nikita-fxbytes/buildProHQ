"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MESSAGES } from "@/constants/messages";
import { ROUTES } from "@/constants/routes";
import { managerAddTaskSchema, type ManagerAddTaskFormValues } from "@/schemas/manager-add-task.schema";
import { getApiErrorMessage } from "@/services/apiError";
import { managerAddTaskService, type ManagerAddTaskLookups } from "@/services/managerAddTask.service";
import { appToast } from "@/utils/toast";
import type { UploadItem } from "@/components/common/FormUploadField";
import { revokeBlobUrls } from "@/utils/uploadItems";
import { useTaskDescriptionTools } from "@/hooks/useTaskDescriptionTools";
import { emitTasksChanged } from "@/utils/taskEvents";

export function useManagerAddTaskController() {
  const router = useRouter();
  const [lookups, setLookups] = useState<ManagerAddTaskLookups | null>(null);
  const [loadingLookups, setLoadingLookups] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [photos, setPhotos] = useState<UploadItem[]>([]);

  const form = useForm<ManagerAddTaskFormValues>({
    resolver: zodResolver(managerAddTaskSchema),
    defaultValues: {
      description: "",
      levelId: "",
      tradeId: "",
      priorityId: "",
    },
  });

  const { voiceActive, toggleVoice, onPaste } = useTaskDescriptionTools(form);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await managerAddTaskService.loadLookups();
        setLookups(data);
        form.setValue("priorityId", data.defaultPriorityId);
      } catch (e) {
        appToast.error(getApiErrorMessage(e, MESSAGES.task.loadFailed));
      } finally {
        setLoadingLookups(false);
      }
    };
    void load();
  }, [form]);

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
      await managerAddTaskService.createTaskWithOptionalPhotos(
        {
          statusId: lookups.openStatusId,
          levelId: values.levelId,
          tradeId: values.tradeId,
          priorityId: values.priorityId,
          description: values.description,
        },
        files,
      );
      appToast.success(MESSAGES.task.created);
      setPhotos((prev) => {
        revokeBlobUrls(prev);
        return [];
      });
      emitTasksChanged();
      router.push(ROUTES.MANAGER_TASKS);
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

  const onCancel = () => router.push(ROUTES.MANAGER_TASKS);

  return {
    form,
    lookups,
    loadingLookups,
    submitting,
    levels: lookups?.levels ?? [],
    trades: lookups?.trades ?? [],
    priorities: lookups?.priorities ?? [],
    photos,
    setPhotos,
    onSubmit,
    onCancel,
    onPaste,
    toggleVoice,
    voiceActive,
  };
}

