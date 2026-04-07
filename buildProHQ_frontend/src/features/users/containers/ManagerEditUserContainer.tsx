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
      loading={controller.loading}
      cropOpen={controller.cropOpen}
      pendingFile={controller.pendingFile}
      avatarItems={controller.avatarItems}
      onAvatarItemsChange={controller.onAvatarItemsChange}
      onCloseCrop={controller.onCloseCrop}
      onCropped={controller.onCropped}
    />
  );
}

