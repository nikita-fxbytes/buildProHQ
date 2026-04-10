"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { resolveUserCreateIds, type UserCreateLookups } from "@/features/users/userMappers";
import { MESSAGES } from "@/constants/messages";
import { ROUTES } from "@/constants/routes";
import { lookupsApi } from "@/services/lookupsApi.service";
import { usersApi } from "@/services/usersApi.service";
import { userSchema, type UserFormValues } from "@/schemas/user.schema";
import { appToast } from "@/utils/toast";
import { getApiErrorMessage } from "@/services/apiError";
import { uploadsApi } from "@/services/uploadsApi.service";
import type { UploadItem } from "@/components/common/FormUploadField";
import { resolvePublicUrl } from "@/utils/urls";
import { emitUsersChanged } from "@/utils/taskEvents";

export function useManagerAddUserController(opts?: { redirectHref?: string }) {
  const router = useRouter();
  const redirectHref = opts?.redirectHref ?? ROUTES.MANAGER_USERS;
  const [lookups, setLookups] = useState<UserCreateLookups | null>(null);
  const [loadingLookups, setLoadingLookups] = useState(true);
  const [cropOpen, setCropOpen] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [avatarItems, setAvatarItems] = useState<UploadItem[]>([]);
  const [pendingAvatarId, setPendingAvatarId] = useState<string | null>(null);
  const [cropDraftItem, setCropDraftItem] = useState<UploadItem | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "User",
      avatarUrl: "",
      password: "",
    },
  });

  useEffect(() => {
    if (pendingFile) setCropOpen(true);
  }, [pendingFile]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [types, statuses, roles] = await Promise.all([
          lookupsApi.getUserTypes(),
          lookupsApi.getUserStatuses(),
          lookupsApi.getRoles(),
        ]);
        if (!cancelled) setLookups({ types, statuses, roles });
      } catch {
        if (!cancelled) appToast.error(MESSAGES.common.somethingWrong);
      } finally {
        if (!cancelled) setLoadingLookups(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!lookups) {
      appToast.error(MESSAGES.common.somethingWrong);
      return;
    }
    const ids = resolveUserCreateIds(values.role, lookups);
    if (!ids) {
      appToast.error(MESSAGES.common.somethingWrong);
      return;
    }
    try {
      setSubmitting(true);
      await usersApi.create({
        userTypeId: ids.userTypeId,
        userStatusId: ids.userStatusId,
        fullName: values.name,
        email: values.email,
        avatarUrl: values.avatarUrl?.trim() || undefined,
        password: values.password?.trim() || undefined,
        roleId: ids.roleId,
      });
      emitUsersChanged();
      appToast.success(MESSAGES.user.created);
      router.push(redirectHref);
    } catch (e) {
      appToast.error(getApiErrorMessage(e, MESSAGES.common.saveFailed));
    } finally {
      setSubmitting(false);
    }
  });

  const onCancel = () => {
    router.push(redirectHref);
  };

  return {
    form,
    onSubmit,
    onCancel,
    loadingLookups,
    submitting,
    uploadingAvatar,
    cropOpen,
    pendingFile,
    avatarItems,
    onAvatarItemsChange: (items: UploadItem[]) => {
      // Single mode: either empty or one item.
      const next = items.filter((i) => i.status !== "toDelete");
      if (!next.length) {
        setAvatarItems([]);
        setPendingAvatarId(null);
        setCropDraftItem(null);
        form.setValue("avatarUrl", "", { shouldDirty: true, shouldValidate: true });
        return;
      }
      const item = next[0];
      if (item.file) {
        // Intercept freshly picked file and crop it before upload.
        setPendingAvatarId(item.id);
        setPendingFile(item.file);
        setCropOpen(true);
        // Keep local state so user sees something selected (even before upload).
        setAvatarItems([item]);
        setCropDraftItem(item);
        return;
      }
      // Uploaded state (url only)
      setAvatarItems([item]);
    },
    onCloseCrop: () => {
      setCropOpen(false);
      setPendingFile(null);
      setPendingAvatarId(null);
      // Cancel should not keep a newly selected (uncropped/unuploaded) image.
      if (cropDraftItem?.status === "new") {
        if (cropDraftItem.url?.startsWith("blob:")) URL.revokeObjectURL(cropDraftItem.url);
        setAvatarItems([]);
        form.setValue("avatarUrl", "", { shouldDirty: true, shouldValidate: true });
      }
      setCropDraftItem(null);
    },
    onCropped: async (file: File) => {
      setCropOpen(false);
      setPendingFile(null);
      setUploadingAvatar(true);
      try {
        const uploaded = await uploadsApi.uploadImage(file);
        const id = pendingAvatarId ?? `${file.name}-${file.size}-${file.lastModified}`;
        setAvatarItems([{ id, url: uploaded.fileUrl, status: "uploaded" }]);
        setPendingAvatarId(null);
        setCropDraftItem(null);
        form.setValue("avatarUrl", resolvePublicUrl(uploaded.fileUrl), {
          shouldDirty: true,
          shouldValidate: true,
        });
      } finally {
        setUploadingAvatar(false);
      }
    },
    onRemoveAvatar: () => {
      form.setValue("avatarUrl", "", { shouldDirty: true, shouldValidate: true });
      avatarItems.forEach((i) => {
        if (i.url?.startsWith("blob:")) URL.revokeObjectURL(i.url);
      });
      setAvatarItems([]);
    },
  };
}
