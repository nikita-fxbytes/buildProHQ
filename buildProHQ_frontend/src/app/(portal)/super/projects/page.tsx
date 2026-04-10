"use client";

import { SuperProjectsView } from "@/components/projects/SuperProjectsView";
import { useSuperProjectsController } from "@/features/projects/hooks/useSuperProjectsController";

export default function SuperProjectsPage() {
  const c = useSuperProjectsController();
  return (
    <SuperProjectsView
      loading={c.loading}
      initialLoading={c.initialLoading}
      rows={c.rows}
      total={c.total}
      page={c.page}
      pageSize={c.pageSize}
      search={c.search}
      sortKey={c.sortKey}
      sortDirection={c.sortDirection}
      onSortColumn={c.onSortColumn}
      onSearchChange={c.onSearchChange}
      onPageChange={c.onPageChange}
      create={c.create}
      manage={c.manage}
    />
  );
}

