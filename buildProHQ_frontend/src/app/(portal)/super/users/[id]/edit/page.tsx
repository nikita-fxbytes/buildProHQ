"use client";

import { ManagerEditUserContainer } from "@/features/users/containers/ManagerEditUserContainer";
import { ROUTES } from "@/constants/routes";

export default function SuperEditUserPage() {
    return <ManagerEditUserContainer basePath={ROUTES.SUPER_USERS} />;
}
