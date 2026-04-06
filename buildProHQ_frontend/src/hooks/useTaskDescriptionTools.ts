"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MESSAGES } from "@/constants/messages";
import { appendPlainTextToRichHtml } from "@/utils/richText";
import { appToast } from "@/utils/toast";

type FormLike = {
  getValues: (name: "description") => string;
  setValue: (
    name: "description",
    value: string,
    options?: { shouldValidate?: boolean },
  ) => void;
};

export function useTaskDescriptionTools(form: FormLike) {
  const [voiceActive, setVoiceActive] = useState(false);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        /* ignore */
      }
    };
  }, []);

  const onPaste = useCallback(async () => {
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
  }, [form]);

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
    rec.onstart = () => setVoiceActive(true);
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
    rec.onend = () => setVoiceActive(false);
    try {
      rec.start();
    } catch {
      appToast.error(MESSAGES.validation.voiceError);
    }
  }, [voiceActive, form]);

  return { voiceActive, toggleVoice, onPaste };
}

