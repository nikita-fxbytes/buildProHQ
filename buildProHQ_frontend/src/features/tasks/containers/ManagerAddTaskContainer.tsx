"use client";

import { ManagerAddTaskView } from "@/components/tasks/ManagerAddTaskView";
import { useManagerAddTaskController } from "@/features/tasks/hooks/useManagerAddTaskController";

export function ManagerAddTaskContainer() {
  const controller = useManagerAddTaskController();
  return (
    <ManagerAddTaskView
      form={controller.form}
      levels={controller.levels}
      trades={controller.trades}
      onSubmit={controller.onSubmit}
      onCancel={controller.onCancel}
      onPaste={controller.onPaste}
      toggleVoice={controller.toggleVoice}
      voiceActive={controller.voiceActive}
    />
  );
}

