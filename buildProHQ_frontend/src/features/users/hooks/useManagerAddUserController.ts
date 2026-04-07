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

export function useManagerAddUserController() {
  const router = useRouter();
  const [lookups, setLookups] = useState<UserCreateLookups | null>(null);
  const [loadingLookups, setLoadingLookups] = useState(true);

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
      await usersApi.create({
        userTypeId: ids.userTypeId,
        userStatusId: ids.userStatusId,
        fullName: values.name,
        email: values.email,
        password: values.password?.trim() || undefined,
        roleId: ids.roleId,
      });
      appToast.success(MESSAGES.user.created);
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
    loadingLookups,
  };
}
