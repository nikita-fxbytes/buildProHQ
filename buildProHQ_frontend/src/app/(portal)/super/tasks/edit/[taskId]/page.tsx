"use client";

import { SuperTaskEditContainer } from "@/features/tasks/containers/SuperTaskEditContainer";

export default function SuperEditTaskPage({ params }: { params: { taskId: string } }) {
  return <SuperTaskEditContainer taskId={params.taskId} />;
}

