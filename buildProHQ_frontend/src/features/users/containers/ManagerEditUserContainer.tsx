"use client";

import { ManagerEditUserView } from "@/components/users/ManagerEditUserView";
import { useManagerEditUserController } from "@/features/users/hooks/useManagerEditUserController";

export function ManagerEditUserContainer() {
  const controller = useManagerEditUserController();
  return (
    <ManagerEditUserView
      form={controller.form}
      onSubmit={controller.onSubmit}
      onCancel={controller.onCancel}
    />
  );
}

