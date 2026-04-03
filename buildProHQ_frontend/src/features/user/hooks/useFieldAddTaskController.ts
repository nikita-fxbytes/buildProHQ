"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { appendPlainTextToRichHtml } from "@/utils/richText";
import { appToast } from "@/utils/toast";
import type { UploadItem } from "@/components/common/FormUploadField";

export function useFieldAddTaskController() {
  const router = useRouter();
  const [lookups, setLookups] = useState<FieldAddTaskLookups | null>(null);
  const [loadingLookups, setLoadingLookups] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [photos, setPhotos] = useState<UploadItem[]>([]);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  const form = useForm<FieldAddTaskFormValues>({
    resolver: zodResolver(fieldAddTaskSchema),
    defaultValues: {
      description: "",
      levelId: "",
      tradeId: "",
      priorityId: "",
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fieldAddTaskService.loadLookups();
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

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        /* ignore */
      }
    };
  }, []);

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
      setPhotos((prev) => {
        prev.forEach((p) => {
          if (p.url.startsWith("blob:")) URL.revokeObjectURL(p.url);
        });
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

  const onPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const current = form.getValues("description");
      form.setValue("description", appendPlainTextToRichHtml(current, text), {
        shouldValidate: true,
      });
      appToast.info(MESSAGES.validation.clipboardPasted);
    } catch {
      appToast.error(MESSAGES.validation.clipboardDenied);
    }
  };

  const toggleVoice = useCallback(() => {
    type SpeechRecognitionApi = {
      lang: string;
      interimResults: boolean;
      maxAlternatives: number;
      onstart: (() => void) | null;
      onresult: ((e: Event) => void) | null;
      onerror: (() => void) | null;
      onend: (() => void) | null;
      start: () => void;
      stop: () => void;
    };
    type SpeechRecognitionCtor = new () => SpeechRecognitionApi;
    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (!SR) {
      appToast.error(MESSAGES.validation.voiceNotSupported);
      return;
    }

    if (voiceActive) {
      try {
        recognitionRef.current?.stop();
      } catch {
        /* ignore */
      }
      setVoiceActive(false);
      appToast.info(MESSAGES.validation.voiceStopped);
      return;
    }

    const rec = new SR();
    recognitionRef.current = rec;
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => {
      setVoiceActive(true);
    };
    rec.onresult = (event: Event) => {
      const ev = event as unknown as {
        results: ArrayLike<{ 0?: { transcript?: string } }>;
      };
      const text = ev.results[0]?.[0]?.transcript ?? "";
      if (!text) return;
      const cur = form.getValues("description");
      form.setValue("description", appendPlainTextToRichHtml(cur, text.trim()), {
        shouldValidate: true,
      });
    };
    rec.onerror = () => {
      setVoiceActive(false);
      appToast.error(MESSAGES.validation.voiceError);
    };
    rec.onend = () => {
      setVoiceActive(false);
    };
    try {
      rec.start();
    } catch {
      appToast.error(MESSAGES.validation.voiceError);
    }
  }, [voiceActive, form]);

  return {
    form,
    lookups,
    loadingLookups,
    submitting,
    levels: lookups?.levels ?? [],
    trades: lookups?.trades ?? [],
    priorityOptions,
    photos,
    setPhotos,
    voiceActive,
    onSubmit,
    onCancel,
    onPaste,
    toggleVoice,
  };
}
