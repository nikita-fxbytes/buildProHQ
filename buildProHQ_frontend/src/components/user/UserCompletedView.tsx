"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { AppButton } from "@/components/common/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import { DoneBadge } from "@/components/common/badges/DoneBadge";
import { FilterChipGroup } from "@/components/common/filters/FilterChipGroup";
import { FilterPanel } from "@/components/common/filters/FilterPanel";
import { PageSizeSelect } from "@/components/common/PageSizeSelect";
import { AppTableCell } from "@/components/common/table/AppTableCell";
import { AppTableEmptyState } from "@/components/common/table/AppTableEmptyState";
import { AppTableHeader } from "@/components/common/table/AppTableHeader";
import { AppGridTableSkeleton } from "@/components/common/skeletons/AppGridTableSkeleton";
import { AppTablePagination } from "@/components/common/table/AppTablePagination";
import { AppTableRow } from "@/components/common/table/AppTableRow";
import { AppTableShell } from "@/components/common/table/AppTableShell";
import { PageToolbar } from "@/components/common/toolbar/PageToolbar";
import { SearchInput } from "@/components/common/SearchInput";
import type { ListCompletedTasksBody } from "@/services/tasksApi.service";
import type { FieldCompletedTaskRow } from "@/types/domain";
import { MESSAGES } from "@/constants/messages";
import { htmlToPlainText } from "@/utils/richText";

type CompletedSortKey = NonNullable<ListCompletedTasksBody["sortBy"]>;

type Props = {
  loading: boolean;
  search: string;
  setSearch: (value: string) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  total: number;
  rows: FieldCompletedTaskRow[];
  tradeOptions: Array<string | { value: string; label: string }>;
  levelOptions: Array<string | { value: string; label: string }>;
  tradeFilters: string[];
  levelFilters: string[];
  setTradeFilters: (value: string) => void;
  setLevelFilters: (value: string) => void;
  clearFilters: () => void;
  sortKey: CompletedSortKey | null;
  sortDirection: "asc" | "desc";
  onSortColumn: (key: CompletedSortKey) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
};

export function UserCompletedView(props: Props) {
  const filterCount = props.tradeFilters.length + props.levelFilters.length;
  const isFiltered =
    filterCount > 0 || props.search.trim().length > 0;

  return (
    <Stack spacing={2}>
      <PageToolbar>
        <Box sx={{ flex: 1, minWidth: 220 }}>
          <SearchInput
            value={props.search}
            placeholder={MESSAGES.task.completedSearchPlaceholder}
            onChange={props.setSearch}
            sx={{
              "& .MuiInputBase-root": {
                fontSize: "13.5px",
              },
              "& .MuiInputBase-input::placeholder": {
                fontSize: "13.5px",
                color: "#7B89A8",
                opacity: 1,
              },
            }}
          />
        </Box>
        <AppButton
          type="button"
          variant="outlined"
          size="small"
          onClick={() => props.setShowFilters(!props.showFilters)}
          sx={{ borderColor: "#E4E8F0", color: "#1A2035", fontSize: "13px" }}
        >
          <AppIcon name="filters" size={14} /> {MESSAGES.task.completedFilters}{" "}
          {filterCount > 0 ? (
            <Box
              component="span"
              sx={{
                ml: 0.75,
                background: "#F5A623",
                color: "#fff",
                borderRadius: "10px",
                px: 0.75,
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {filterCount}
            </Box>
          ) : null}
        </AppButton>
        <PageSizeSelect value={props.pageSize} onChange={props.setPageSize} />
      </PageToolbar>

      <FilterPanel open={props.showFilters}>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "16px" }}>
          <FilterChipGroup
            label="Trade"
            options={props.tradeOptions}
            selected={props.tradeFilters}
            onToggle={props.setTradeFilters}
          />
          <FilterChipGroup
            label="Level"
            options={props.levelOptions}
            selected={props.levelFilters}
            onToggle={props.setLevelFilters}
          />
        </Box>
        <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #E4E8F0" }}>
          <AppButton
            type="button"
            size="small"
            variant="contained"
            color="error"
            onClick={props.clearFilters}
            sx={{ background: "#FEE2E2", color: "#EF4444", boxShadow: "none" }}
          >
            {MESSAGES.task.completedClearFilters}
          </AppButton>
        </Box>
      </FilterPanel>

      <AppTableShell>
        <AppTableHeader
          columnsTemplate="80px 130px 1fr 80px 100px"
          columns={[
            { key: "level", label: "Level", sortable: true },
            { key: "trade", label: "Trade", sortable: true },
            { key: "description", label: "Description", sortable: true },
            { key: "closedAt", label: "Date", sortable: true },
            { key: "daysOpen", label: "Duration", sortable: true },
          ]}
          sortKey={props.sortKey}
          sortDirection={props.sortDirection}
          onSort={(key) => props.onSortColumn(key as CompletedSortKey)}
        />

        {props.loading ? (
          <AppGridTableSkeleton columnsTemplate="80px 130px 1fr 80px 100px" rowCount={8} />
        ) : props.rows.length === 0 ? (
          <AppTableEmptyState
            icon={<AppIcon name="complete" size={36} />}
            message={
              isFiltered
                ? MESSAGES.task.completedEmptyFiltered
                : MESSAGES.task.completedEmpty
            }
          />
        ) : (
          props.rows.map((task) => (
            <AppTableRow
              key={task.id}
              columnsTemplate="80px 130px 1fr 80px 100px"
            >
              <AppTableCell variant="level">{task.level}</AppTableCell>
              <AppTableCell variant="trade">{task.trade}</AppTableCell>
              <AppTableCell variant="text">{htmlToPlainText(task.desc)}</AppTableCell>
              <AppTableCell variant="muted">{task.date}</AppTableCell>
              <DoneBadge label={`${task.duration}d`} />
            </AppTableRow>
          ))
        )}

        <AppTablePagination
          page={props.page}
          pageSize={props.pageSize}
          total={props.total}
          onChange={props.setPage}
        />
      </AppTableShell>
    </Stack>
  );
}
