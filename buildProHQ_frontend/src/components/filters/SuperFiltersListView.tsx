"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { AppButton } from "@/components/common/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
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

const COLUMNS_TEMPLATE = "200px 200px 120px 120px 1fr 150px";

export type SuperFiltersListViewProps = {
  loading: boolean;
  rows: SuperFilterListRow[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  onSearchChange: (v: string) => void;
  onPageChange: (p: number) => void;
  deleteCategory: (id: string) => void;
  /** When set, show “Add filter” (defaults to super-admin route). */
  addFilterHref?: string | null;
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
        {(() => {
          const addHref = props.addFilterHref === undefined ? ROUTES.SUPER_FILTER_NEW : props.addFilterHref;
          return addHref ? (
            <AppButton component={Link} href={addHref} variant="contained">
              + Add Filter
            </AppButton>
          ) : null;
        })()}
      </PageToolbar>

      <AppTableShell>
        <AppTableHeader
          columnsTemplate={COLUMNS_TEMPLATE}
          columns={[
            { key: "project", label: "Project", sortable: false },
            { key: "name", label: "Name", sortable: false },
            { key: "type", label: "Type", sortable: false },
            { key: "multi", label: "Multi", sortable: false },
            { key: "preview", label: "Details" },
            { key: "actions", label: "Actions" },
          ]}
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
                <AppTableCell variant="trade">{r.projectName ?? "—"}</AppTableCell>
                <AppTableCell variant="level">{r.name}</AppTableCell>
                <AppTableCell variant="text">{r.type === "sub_filter" ? "Sub-filters" : "Simple"}</AppTableCell>
                <AppTableCell variant="text">{r.hasSubFilters && r.isMultiSelect ? "Yes" : "—"}</AppTableCell>
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
                    {r.type === "sub_filter" ? "Autocomplete options" : "Free text on task form"}
                  </Typography>
                </AppTableCell>
                <AppTableCell className="table-cell-actions">
                  <Box sx={{ width: "100%", display: "inline-flex", justifyContent: "flex-end", gap: 0.5 }}>
                    <Tooltip title="Edit" arrow>
                      <IconButton
                        component={Link as any}
                        href={`/super/filters/${encodeURIComponent(r.id)}/edit`}
                        aria-label="Edit filter"
                        size="small"
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: "8px",
                          border: "1.5px solid #E4E8F0",
                          background: "#fff",
                        }}
                      >
                        <AppIcon name="edit" size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                      <IconButton
                        aria-label="Delete filter"
                        size="small"
                        onClick={() => setConfirm({ id: r.id, name: r.name })}
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: "8px",
                          border: "1.5px solid #FEE2E2",
                          color: "#EF4444",
                          background: "#fff",
                        }}
                      >
                        <AppIcon name="delete" size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
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

