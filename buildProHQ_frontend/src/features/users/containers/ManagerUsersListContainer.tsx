"use client";

import { ManagerUsersListView } from "@/components/users/ManagerUsersListView";
import { useManagerUsersListController } from "@/features/users/hooks/useManagerUsersListController";

export function ManagerUsersListContainer(props?: { addUserHref?: string; editUserHref?: (id: string) => string; }) {
  const controller = useManagerUsersListController();
  return <ManagerUsersListView {...controller} addUserHref={props?.addUserHref} editUserHref={props?.editUserHref} />;
}

