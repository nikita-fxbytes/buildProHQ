"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MESSAGES } from "@/constants/messages";
import { ROUTES } from "@/constants/routes";
import { userService } from "@/services/user.service";
import { userSchema, type UserFormValues } from "@/schemas/user.schema";
import { appToast } from "@/utils/toast";

export function useManagerEditUserController() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = Number(params.id);

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
    if (!Number.isFinite(id)) return;
    const load = async () => {
      try {
        const user = await userService.getUserById(id);
        if (!user) {
          appToast.error(MESSAGES.common.somethingWrong);
          router.push(ROUTES.MANAGER_USERS);
          return;
        }
        form.reset({
          name: user.name,
          email: user.email,
          role: user.role,
          password: "",
        });
      } catch {
        appToast.error(MESSAGES.common.somethingWrong);
        router.push(ROUTES.MANAGER_USERS);
      }
    };
    void load();
  }, [form, id, router]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const updated = await userService.updateUser(id, {
        name: values.name,
        email: values.email,
        role: values.role,
        password: values.password?.trim() ? values.password : undefined,
      });
      if (!updated) {
        appToast.error(MESSAGES.common.saveFailed);
        return;
      }
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
  };
}

