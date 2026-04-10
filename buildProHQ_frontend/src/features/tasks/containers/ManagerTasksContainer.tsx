"use client";

import { ManagerTasksView } from "@/components/tasks/ManagerTasksView";
import { useManagerTasksController } from "@/features/tasks/hooks/useManagerTasksController";
import { ROUTES } from "@/constants/routes";

export function ManagerTasksContainer(props: { mode?: "manager" | "super" }) {
  const controller = useManagerTasksController({ mode: props.mode ?? "manager" });
  const addTaskHref =
    props.mode === "super" ? ROUTES.SUPER_CREATE_TASK : ROUTES.MANAGER_ADD_TASK;
  return <ManagerTasksView {...controller} addTaskHref={addTaskHref} />;
}

