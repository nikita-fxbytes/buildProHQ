"use client";

import { ManagerTasksView } from "@/components/tasks/ManagerTasksView";
import { useManagerTasksController } from "@/features/tasks/hooks/useManagerTasksController";

export function ManagerTasksContainer() {
  const controller = useManagerTasksController();
  return <ManagerTasksView {...controller} />;
}

