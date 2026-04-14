"use client";

import { SuperTaskEditView } from "@/features/tasks/super-admin/SuperTaskEditView";
import { useSuperTaskEditController } from "@/features/tasks/hooks/useSuperTaskEditController";

export function SuperTaskEditContainer(props: { taskId: string }) {
  const c = useSuperTaskEditController({ taskId: props.taskId });
  return <SuperTaskEditView {...c} />;
}

