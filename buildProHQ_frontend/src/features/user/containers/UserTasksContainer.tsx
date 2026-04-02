"use client";

import { UserTasksView } from "@/components/user/UserTasksView";
import { useUserTasksController } from "@/features/user/hooks/useUserTasksController";

export function UserTasksContainer() {
  const controller = useUserTasksController();
  return <UserTasksView {...controller} />;
}

