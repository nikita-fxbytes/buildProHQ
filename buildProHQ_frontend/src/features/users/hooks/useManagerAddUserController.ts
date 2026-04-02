"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { MESSAGES } from "@/constants/messages";
import { ROUTES } from "@/constants/routes";
import { userService } from "@/services/user.service";
import { userSchema, type UserFormValues } from "@/schemas/user.schema";
import { appToast } from "@/utils/toast";

export function useManagerAddUserController() {
  const router = useRouter();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "User",
      password: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await userService.createUser({
        name: values.name,
        email: values.email,
        role: values.role,
        password: values.password?.trim() ? values.password : null,
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
  };
}

