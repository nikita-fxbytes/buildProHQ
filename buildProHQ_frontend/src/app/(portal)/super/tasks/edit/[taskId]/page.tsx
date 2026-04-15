"use client";

import { useParams } from "next/navigation";
import { SuperTaskEditContainer } from "@/features/tasks/containers/SuperTaskEditContainer";
import { taskIdFromParams } from "@/utils/taskRouteParams";

export default function SuperEditTaskPage() {
  const params = useParams();
  const taskId = taskIdFromParams(params?.taskId);
  return <SuperTaskEditContainer taskId={taskId} />;
}
