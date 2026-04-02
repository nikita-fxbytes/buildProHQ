"use client";

import { UserCompletedView } from "@/components/user/UserCompletedView";
import { useUserCompletedController } from "@/features/user/hooks/useUserCompletedController";

export function UserCompletedContainer() {
  const controller = useUserCompletedController();
  return <UserCompletedView {...controller} />;
}

