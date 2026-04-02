"use client";

import { ManagerCompletedView } from "@/components/tasks/ManagerCompletedView";
import { useManagerCompletedController } from "@/features/tasks/hooks/useManagerCompletedController";

export function ManagerCompletedContainer() {
  const controller = useManagerCompletedController();
  return <ManagerCompletedView {...controller} />;
}

