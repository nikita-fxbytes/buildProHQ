"use client";

import { SuperProjectsHtmlView } from "@/features/projects/super-admin/SuperProjectsHtmlView";
import { useSuperProjectsListController } from "@/features/projects/hooks/useSuperProjectsListController";

export default function SuperProjectsPage() {
  const c = useSuperProjectsListController();

  return (
    <SuperProjectsHtmlView
      loading={c.loading}
      initialLoading={c.initialLoading}
      page={c.page}
      pageSize={c.pageSize}
      total={c.total}
      search={c.search}
      sortKey={c.sortKey}
      sortDirection={c.sortDirection ?? "asc"}
      sortPreset={c.sortPreset}
      rows={c.rows.map((p) => ({
        id: p.id,
        name: p.name,
        managers: p.membersManagers ?? 0,
        trades: p.membersTrades ?? 0,
        field: p.membersField ?? 0,
        total: p.membersTotal ?? 0,
      }))}
      onSearchChange={(v) => {
        c.setSearch(v);
        c.setPage(1);
      }}
      onSortColumn={(col) => c.onSortColumn(col)}
      onSortPresetChange={(preset) => c.setSortPreset(preset)}
      onPageChange={c.setPage}
      delete={{
        ...c.delete,
        project: c.delete.project
          ? {
              id: c.delete.project.id,
              name: c.delete.project.name,
              managers: c.delete.project.membersManagers ?? 0,
              trades: c.delete.project.membersTrades ?? 0,
              field: c.delete.project.membersField ?? 0,
              total: c.delete.project.membersTotal ?? 0,
            }
          : null,
        openModal: (p) => {
          // bridge view row shape back to controller row
          const match = c.rows.find((x) => x.id === p.id);
          if (match) c.delete.openModal(match);
        },
      }}
      create={c.create}
      manage={{
        ...c.manage,
        project: c.manage.project
          ? {
              id: c.manage.project.id,
              name: c.manage.project.name,
              managers: c.manage.project.membersManagers ?? 0,
              trades: c.manage.project.membersTrades ?? 0,
              field: c.manage.project.membersField ?? 0,
              total: c.manage.project.membersTotal ?? 0,
            }
          : null,
      }}
    />
  );
}

