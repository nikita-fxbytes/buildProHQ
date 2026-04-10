"use client";

import { FieldAddTaskView } from "../../../components/user/FieldAddTaskView";
import { useFieldAddTaskController } from "../hooks/useFieldAddTaskController";

export function FieldAddTaskContainer() {
  const controller = useFieldAddTaskController();

  return (
    <FieldAddTaskView
      form={controller.form}
      projects={controller.projects.map((p) => ({ id: p.id, code: p.code, name: p.name }))}
      levels={controller.levels}
      trades={controller.trades}
      priorityOptions={controller.priorityOptions}
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
