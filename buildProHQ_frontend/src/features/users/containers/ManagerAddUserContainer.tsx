"use client";

import { ManagerAddUserView } from "@/components/users/ManagerAddUserView";
import { useManagerAddUserController } from "@/features/users/hooks/useManagerAddUserController";

export function ManagerAddUserContainer(props?: { redirectHref?: string }) {
  const controller = useManagerAddUserController({ redirectHref: props?.redirectHref });
  return (
    <ManagerAddUserView
      form={controller.form}
      onSubmit={controller.onSubmit}
      onCancel={controller.onCancel}
      loading={controller.loadingLookups || controller.uploadingAvatar || controller.submitting}
      cropOpen={controller.cropOpen}
      pendingFile={controller.pendingFile}
      avatarItems={controller.avatarItems}
      onAvatarItemsChange={controller.onAvatarItemsChange}
      onCloseCrop={controller.onCloseCrop}
      onCropped={controller.onCropped}
    />
  );
}

