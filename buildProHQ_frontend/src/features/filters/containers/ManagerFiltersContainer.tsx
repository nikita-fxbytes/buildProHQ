"use client";

import { ManageFiltersView } from "@/components/filters/ManageFiltersView";
import { useManageFiltersController } from "@/features/filters/hooks/useManageFiltersController";

export function ManagerFiltersContainer() {
  const controller = useManageFiltersController();
  return <ManageFiltersView {...controller} />;
}

