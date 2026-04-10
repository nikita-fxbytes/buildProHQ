"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppButton } from "@/components/common/AppButton";
import { AppGridTableSkeleton } from "@/components/common/skeletons/AppGridTableSkeleton";
import { SearchInput } from "@/components/common/SearchInput";
import { AppTableCell } from "@/components/common/table/AppTableCell";
import { AppTableEmptyState } from "@/components/common/table/AppTableEmptyState";
import { AppTableHeader } from "@/components/common/table/AppTableHeader";
import { AppTablePagination } from "@/components/common/table/AppTablePagination";
import { AppTableRow } from "@/components/common/table/AppTableRow";
import { AppTableShell } from "@/components/common/table/AppTableShell";
import { PageToolbar } from "@/components/common/toolbar/PageToolbar";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { ROUTES } from "@/constants/routes";
import { useState } from "react";
import type { SuperFilterListRow } from "@/features/filters/hooks/useSuperFiltersListController";

const COLUMNS_TEMPLATE = "200px 180px 1fr 140px 150px";

export type SuperFiltersListViewProps = {
  loading: boolean;
  rows: SuperFilterListRow[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  sortKey: "project" | "category" | "subFilters";
  sortDirection: "asc" | "desc";
  onSortColumn: (key: "project" | "category" | "subFilters") => void;
  onSearchChange: (v: string) => void;
  onPageChange: (p: number) => void;
  deleteCategory: (id: string) => void;
};

export function SuperFiltersListView(props: SuperFiltersListViewProps) {
  const [confirm, setConfirm] = useState<null | { id: string; name: string }>(null);
  const initialLoading = props.loading && props.rows.length === 0;

  return (
    <Stack spacing={2}>
      <PageToolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ flex: 1, minWidth: 260 }}>
          <SearchInput
            value={props.search}
            placeholder="Search by project, category or sub-filters..."
            onChange={props.onSearchChange}
          />
        </Box>
        <AppButton component={Link} href={ROUTES.SUPER_FILTER_NEW} variant="contained">
          + Add Filter
        </AppButton>
      </PageToolbar>

      <AppTableShell>
        <AppTableHeader
          columnsTemplate={COLUMNS_TEMPLATE}
          columns={[
            { key: "project", label: "Project", sortable: true },
            { key: "category", label: "Category", sortable: true },
            { key: "subFilters", label: "Sub-filters", sortable: true, sortKey: "subFilters" },
            { key: "preview", label: "Preview" },
            { key: "actions", label: "Actions" },
          ]}
          sortKey={props.sortKey}
          sortDirection={props.sortDirection}
          onSort={(k) => props.onSortColumn(k as any)}
          className="mgmt"
        />

        {initialLoading ? (
          <AppGridTableSkeleton columnsTemplate={COLUMNS_TEMPLATE} rowCount={8} />
        ) : props.rows.length === 0 ? (
          <AppTableEmptyState message="No filters found." />
        ) : (
          <>
            {props.rows.map((r) => (
              <AppTableRow key={r.id} columnsTemplate={COLUMNS_TEMPLATE} className="mgmt">
                <AppTableCell variant="trade">{r.projectName}</AppTableCell>
                <AppTableCell variant="level">{r.categoryName}</AppTableCell>
                <AppTableCell variant="text" sx={{ fontWeight: 900 }}>
                  {r.subFiltersCount}
                </AppTableCell>
                <AppTableCell variant="muted" sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 12.5,
                      color: "inherit",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {r.subFiltersPreview}
                  </Typography>
                </AppTableCell>
                <AppTableCell className="table-cell-actions">
                  <AppButton
                    component={Link}
                    href={`/super/filters/${encodeURIComponent(r.id)}/edit`}
                    variant="outlined"
                    size="small"
                  >
                    Edit
                  </AppButton>
                  <AppButton
                    variant="outlined"
                    size="small"
                    sx={{ ml: 1 }}
                    onClick={() => setConfirm({ id: r.id, name: r.categoryName })}
                  >
                    Delete
                  </AppButton>
                </AppTableCell>
              </AppTableRow>
            ))}
          </>
        )}

        <Box sx={{ pt: 1 }}>
          <AppTablePagination
            page={props.page}
            pageSize={props.pageSize}
            total={props.total}
            onChange={props.onPageChange}
            managerMode
          />
        </Box>
      </AppTableShell>

      <ConfirmModal
        open={!!confirm}
        title="Delete filter?"
        message={confirm ? `This will delete "${confirm.name}" and all its sub-filters.` : ""}
        confirmLabel="Delete"
        confirmColor="error"
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          const id = confirm?.id;
          setConfirm(null);
          if (id) props.deleteCategory(id);
        }}
      />
    </Stack>
  );
}

