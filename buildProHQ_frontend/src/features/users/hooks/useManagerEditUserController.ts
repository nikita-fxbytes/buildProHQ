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

export function useManagerEditUserController() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id ?? "";
  const [lookups, setLookups] = useState<UserCreateLookups | null>(null);
  const [loadedUser, setLoadedUser] = useState<UserListItem | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "User",
      password: "",
    },
  });

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
          password: "",
        });
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
      await usersApi.update(id, {
        fullName: values.name,
        email: values.email,
        userTypeId: ids.userTypeId,
        userStatusId: statusId,
        roleId: ids.roleId,
        password: values.password?.trim() || undefined,
      });
      appToast.success(MESSAGES.user.updated);
      router.push(ROUTES.MANAGER_USERS);
    } catch {
      appToast.error(MESSAGES.common.saveFailed);
    }
  });

  const onCancel = () => {
    router.push(ROUTES.MANAGER_USERS);
  };

  return {
    form,
    onSubmit,
    onCancel,
    loading,
  };
}
