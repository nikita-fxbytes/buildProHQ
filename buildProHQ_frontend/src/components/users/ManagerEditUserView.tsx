"use client";

import type { UseFormReturn } from "react-hook-form";
import type { UploadItem } from "@/components/common/FormUploadField";
import { ManagerUserFormView } from "@/components/users/ManagerUserFormView";
import type { UserFormValues } from "@/schemas/user.schema";

export type ManagerEditUserViewProps = {
  form: UseFormReturn<UserFormValues>;
  onSubmit: () => void;
  onCancel: () => void;
  loading: boolean;
  cropOpen: boolean;
  pendingFile: File | null;
  avatarItems: UploadItem[];
  onAvatarItemsChange: (items: UploadItem[]) => void;
  onCloseCrop: () => void;
  onCropped: (file: File) => void;
};

export function ManagerEditUserView({
  form,
  onSubmit,
  onCancel,
  loading,
  cropOpen,
  pendingFile,
  avatarItems,
  onAvatarItemsChange,
  onCloseCrop,
  onCropped,
}: ManagerEditUserViewProps) {
  return (
    <ManagerUserFormView
      mode="edit"
      form={form}
      onSubmit={onSubmit}
      onCancel={onCancel}
      loading={loading}
      submitLabel="Update User"
      title="Edit User"
      titleIcon="edit"
      passwordHelperText="Leave blank to keep existing password."
      cropOpen={cropOpen}
      pendingFile={pendingFile}
      avatarItems={avatarItems}
      onAvatarItemsChange={onAvatarItemsChange}
      onCloseCrop={onCloseCrop}
      onCropped={onCropped}
    />
  );
}

