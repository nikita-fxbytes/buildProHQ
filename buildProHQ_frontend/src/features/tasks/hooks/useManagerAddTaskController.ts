"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MESSAGES } from "@/constants/messages";
import { ROUTES } from "@/constants/routes";
import { managerAddTaskSchema, type ManagerAddTaskFormValues } from "@/schemas/manager-add-task.schema";
import { managerAddTaskService } from "@/services/managerAddTask.service";
import { appendPlainTextToRichHtml } from "@/utils/richText";
import { appToast } from "@/utils/toast";

export function useManagerAddTaskController() {
  const router = useRouter();
  const [levels, setLevels] = useState<string[]>([]);
  const [trades, setTrades] = useState<string[]>([]);
  const [voiceActive, setVoiceActive] = useState(false);

  const form = useForm<ManagerAddTaskFormValues>({
    resolver: zodResolver(managerAddTaskSchema),
    defaultValues: {
      desc: "",
      level: "",
      trade: "",
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const options = await managerAddTaskService.getOptions();
        setLevels(options.levels);
        setTrades(options.trades);
      } catch {
        appToast.error(MESSAGES.task.loadFailed);
      }
    };
    void load();
  }, []);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await managerAddTaskService.createTask(values);
      appToast.success(MESSAGES.task.created);
      router.push(ROUTES.MANAGER_TASKS);
    } catch {
      appToast.error(MESSAGES.common.saveFailed);
    }
  });

  const onCancel = () => router.push(ROUTES.MANAGER_TASKS);

  const onPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const current = form.getValues("desc");
      form.setValue("desc", appendPlainTextToRichHtml(current, text), { shouldValidate: true });
      appToast.info(MESSAGES.validation.clipboardPasted);
    } catch {
      appToast.error(MESSAGES.validation.clipboardDenied);
    }
  };

  const toggleVoice = () => {
    setVoiceActive((prev) => !prev);
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      appToast.error("Voice input not supported in this browser.");
      return;
    }
    appToast.info("Voice input is placeholder for this step.");
  };

  return {
    form,
    levels,
    trades,
    onSubmit,
    onCancel,
    onPaste,
    toggleVoice,
    voiceActive,
  };
}

