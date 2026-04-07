"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  mapUserTypeCodeToFormRole,
  resolveUserCreateIds,
  type UserCreateLookups,
} from "@/features/users/userMappers";
import { MESSAGES } from "@/constants/messages";
import { ROUTES } from "@/constants/routes";
import { lookupsApi } from "@/services/lookupsApi.service";
import { usersApi, type UserListItem } from "@/services/usersApi.service";
import { userSchema, type UserFormValues } from "@/schemas/user.schema";
import { appToast } from "@/utils/toast";
import { getApiErrorMessage } from "@/services/apiError";
import { uploadsApi } from "@/services/uploadsApi.service";
import type { UploadItem } from "@/components/common/FormUploadField";
import { resolvePublicUrl } from "@/utils/urls";
import { emitUsersChanged } from "@/utils/taskEvents";

export function useManagerEditUserController() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id ?? "";
  const [lookups, setLookups] = useState<UserCreateLookups | null>(null);
  const [loadedUser, setLoadedUser] = useState<UserListItem | null>(null);
  const [loading, setLoading] = useState(true);
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
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const [user, types, statuses, roles] = await Promise.all([
          usersApi.getById(id),
          lookupsApi.getUserTypes(),
          lookupsApi.getUserStatuses(),
          lookupsApi.getRoles(),
        ]);
        if (cancelled) return;
        setLoadedUser(user);
        setLookups({ types, statuses, roles });
        form.reset({
          name: user.full_name,
          email: user.email,
          role: mapUserTypeCodeToFormRole(user.user_type_code),
          avatarUrl: user.avatar_url ? resolvePublicUrl(user.avatar_url) : "",
          password: "",
        });
        if (user.avatar_url) {
          setAvatarItems([{ id: `avatar-${user.id}`, url: resolvePublicUrl(user.avatar_url), status: "uploaded" }]);
        } else {
          setAvatarItems([]);
        }
      } catch {
        appToast.error(MESSAGES.common.somethingWrong);
        router.push(ROUTES.MANAGER_USERS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [form, id, router]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (!lookups || !id) {
      appToast.error(MESSAGES.common.somethingWrong);
      return;
    }
    const ids = resolveUserCreateIds(values.role, lookups);
    if (!ids) {
      appToast.error(MESSAGES.common.somethingWrong);
      return;
    }
    const statusId =
      lookups.statuses.find((s) => s.code === loadedUser?.user_status_code)?.id ?? ids.userStatusId;
    try {
      setSubmitting(true);
      await usersApi.update(id, {
        fullName: values.name,
        email: values.email,
        userTypeId: ids.userTypeId,
        userStatusId: statusId,
        roleId: ids.roleId,
        // If user removed the avatar, send empty string so backend can clear it.
        avatarUrl: values.avatarUrl?.trim(),
        password: values.password?.trim() || undefined,
      });
      emitUsersChanged();
      appToast.success(MESSAGES.user.updated);
      router.push(ROUTES.MANAGER_USERS);
    } catch (e) {
      appToast.error(getApiErrorMessage(e, MESSAGES.common.saveFailed));
    } finally {
      setSubmitting(false);
    }
  });

  const onCancel = () => {
    router.push(ROUTES.MANAGER_USERS);
  };

  return {
    form,
    onSubmit,
    onCancel,
    loading: loading || uploadingAvatar || submitting,
    cropOpen,
    pendingFile,
    avatarItems,
    onAvatarItemsChange: (items: UploadItem[]) => {
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
        setPendingAvatarId(item.id);
        setPendingFile(item.file);
        setCropOpen(true);
        setAvatarItems([item]);
        setCropDraftItem(item);
        return;
      }
      setAvatarItems([item]);
    },
    onCloseCrop: () => {
      setCropOpen(false);
      setPendingFile(null);
      setPendingAvatarId(null);
      if (cropDraftItem?.status === "new") {
        if (cropDraftItem.url?.startsWith("blob:")) URL.revokeObjectURL(cropDraftItem.url);
        setAvatarItems(loadedUser?.avatar_url ? [{ id: `avatar-${loadedUser.id}`, url: resolvePublicUrl(loadedUser.avatar_url), status: "uploaded" }] : []);
        form.setValue("avatarUrl", loadedUser?.avatar_url ? resolvePublicUrl(loadedUser.avatar_url) : "", { shouldDirty: true, shouldValidate: true });
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
  };
}
