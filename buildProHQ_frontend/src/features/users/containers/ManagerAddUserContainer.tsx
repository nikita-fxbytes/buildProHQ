"use client";

import { ManagerAddUserView } from "@/components/users/ManagerAddUserView";
import { useManagerAddUserController } from "@/features/users/hooks/useManagerAddUserController";

export function ManagerAddUserContainer() {
  const controller = useManagerAddUserController();
  return (
    <ManagerAddUserView
      form={controller.form}
      onSubmit={controller.onSubmit}
      onCancel={controller.onCancel}
    />
  );
}

