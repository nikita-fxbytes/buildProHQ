"use client";

import { SuperFiltersListView } from "@/components/filters/SuperFiltersListView";
import { useSuperFiltersListController } from "@/features/filters/hooks/useSuperFiltersListController";

/** Manager portal: same project-filter list + CRUD via API (add uses super route when available). */
export function ManagerFiltersContainer() {
  const c = useSuperFiltersListController();
  return <SuperFiltersListView {...c} addFilterHref={null} />;
}
