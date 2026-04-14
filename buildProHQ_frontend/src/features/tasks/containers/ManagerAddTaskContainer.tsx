"use client";

import { ManagerAddTaskView } from "@/components/tasks/ManagerAddTaskView";
import { useManagerAddTaskController } from "@/features/tasks/hooks/useManagerAddTaskController";

export function ManagerAddTaskContainer(props?: { mode?: "manager" | "super" }) {
  const controller = useManagerAddTaskController({ mode: props?.mode ?? "manager" });
  return (
    <ManagerAddTaskView
      form={controller.form}
      projects={controller.projects.map((p) => ({ id: p.id, code: p.code, name: p.name }))}
      levels={controller.levels}
      trades={controller.trades}
      priorities={controller.priorities}
      photos={controller.photos}
      setPhotos={controller.setPhotos}
      loadingLookups={controller.loadingLookups}
      submitting={controller.submitting}
      onSubmit={controller.onSubmit}
      onCancel={controller.onCancel}
      onPaste={controller.onPaste}
      toggleVoice={controller.toggleVoice}
      voiceActive={controller.voiceActive}
    />
  );
}

