"use client";

import { SuperFiltersListView } from "@/components/filters/SuperFiltersListView";
import { useSuperFiltersListController } from "@/features/filters/hooks/useSuperFiltersListController";

export function SuperFiltersListContainer() {
  const c = useSuperFiltersListController();
  return <SuperFiltersListView {...c} />;
}

