"use client";

import type { UseFormReturn } from "react-hook-form";
import type { UploadItem } from "@/components/common/FormUploadField";
import { ManagerUserFormView } from "@/components/users/ManagerUserFormView";
import type { UserFormValues } from "@/schemas/user.schema";

export type ManagerAddUserViewProps = {
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

export function ManagerAddUserView({
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
}: ManagerAddUserViewProps) {
  return (
    <ManagerUserFormView
      mode="create"
      form={form}
      onSubmit={onSubmit}
      onCancel={onCancel}
      loading={loading}
      submitLabel="Create User"
      title="Add New User"
      titleIcon="add"
      passwordHelperText="Leave blank to send email invite instead."
      cropOpen={cropOpen}
      pendingFile={pendingFile}
      avatarItems={avatarItems}
      onAvatarItemsChange={onAvatarItemsChange}
      onCloseCrop={onCloseCrop}
      onCropped={onCropped}
    />
  );
}

