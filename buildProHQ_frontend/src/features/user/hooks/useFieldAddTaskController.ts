"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MESSAGES } from "@/constants/messages";
import { ROUTES } from "@/constants/routes";
import { managerAddTaskSchema, type ManagerAddTaskFormValues } from "@/schemas/manager-add-task.schema";
import { fieldAddTaskService } from "@/services/fieldAddTask.service";
import { appToast } from "@/utils/toast";

export function useFieldAddTaskController() {
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
        const options = await fieldAddTaskService.getOptions();
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
      await fieldAddTaskService.createTask(values);
      appToast.success(MESSAGES.task.created);
      router.push(ROUTES.FIELD_TASKS);
    } catch {
      appToast.error(MESSAGES.common.saveFailed);
    }
  });

  const onCancel = () => router.push(ROUTES.FIELD_TASKS);

  const onPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const current = form.getValues("desc");
      form.setValue("desc", `${current ? `${current} ` : ""}${text}`, {
        shouldValidate: true,
      });
      appToast.info("Pasted from clipboard");
    } catch {
      appToast.error("Clipboard access denied. Try Ctrl+V in the text box.");
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
    voiceActive,
    onSubmit,
    onCancel,
    onPaste,
    toggleVoice,
  };
}
