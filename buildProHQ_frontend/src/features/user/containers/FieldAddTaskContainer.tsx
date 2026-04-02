"use client";

import { FieldAddTaskView } from "../../../components/user/FieldAddTaskView";
import { useFieldAddTaskController } from "../hooks/useFieldAddTaskController";

export function FieldAddTaskContainer() {
  const controller = useFieldAddTaskController();

  return (
    <FieldAddTaskView
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
