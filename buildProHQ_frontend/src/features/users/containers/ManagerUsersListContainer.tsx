"use client";

import { ManagerUsersListView } from "@/components/users/ManagerUsersListView";
import { useManagerUsersListController } from "@/features/users/hooks/useManagerUsersListController";

export function ManagerUsersListContainer() {
  const controller = useManagerUsersListController();
  return <ManagerUsersListView {...controller} />;
}

