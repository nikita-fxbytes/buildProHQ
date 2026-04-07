"use client";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { AppButton } from "@/components/common/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import { DoneBadge } from "@/components/common/badges/DoneBadge";
import { InitialsBadge } from "@/components/common/badges/InitialsBadge";
import { FilterChipGroup } from "@/components/common/filters/FilterChipGroup";
import { FilterPanel } from "@/components/common/filters/FilterPanel";
import { AppGridTableSkeleton } from "@/components/common/skeletons/AppGridTableSkeleton";
import { AppTableCell } from "@/components/common/table/AppTableCell";
import { AppTableEmptyState } from "@/components/common/table/AppTableEmptyState";
import { AppTableHeader } from "@/components/common/table/AppTableHeader";
import { AppTablePagination } from "@/components/common/table/AppTablePagination";
import { AppTableRow } from "@/components/common/table/AppTableRow";
import { AppTableShell } from "@/components/common/table/AppTableShell";
import { PageToolbar } from "@/components/common/toolbar/PageToolbar";
import { SearchInput } from "@/components/common/SearchInput";
import { htmlToPlainText } from "@/utils/richText";

type ManagerCompletedViewRow = {
  id: string;
  level: string;
  trade: string;
  user: string;
  desc: string;
  date: string;
  durationDays: number;
};

type Props = {
  loading: boolean;
  search: string;
  setSearch: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  tradeOptions: Array<string | { value: string; label: string }>;
  levelOptions: Array<string | { value: string; label: string }>;
  userOptions: Array<string | { value: string; label: string }>;
  tradeFilters: string[];
  levelFilters: string[];
  userFilters: string[];
  setTradeFilters: (value: string) => void;
  setLevelFilters: (value: string) => void;
  setUserFilters: (value: string) => void;
  clearFilters: () => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  total: number;
  rows: ManagerCompletedViewRow[];
  sortKey: "level" | "trade" | "user" | "description" | "date" | "duration" | null;
  sortDirection: "asc" | "desc";
  onSortColumn: (key: "level" | "trade" | "user" | "description" | "date" | "duration") => void;
};

export function ManagerCompletedView(props: Props) {
  const filterCount =
    props.tradeFilters.length + props.levelFilters.length + props.userFilters.length;
  const initialLoading = props.loading && props.rows.length === 0;

  return (
    <>
      {/* Toolbar: matches .toolbar structure in HTML */}
      <PageToolbar sx={{ gap: "8px", marginBottom: "12px" }}>
        <Box className="search-box" sx={{ flex: 1, minWidth: 220 }}>
          <SearchInput
            value={props.search}
            placeholder="Search completed..."
            onChange={props.setSearch}
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#FFFFFF",
                borderRadius: "8px",
                fontSize: 13,
              },
            }}
          />
        </Box>
        <AppButton
          type="button"
          variant="outlined"
          size="small"
          onClick={() => props.setShowFilters(!props.showFilters)}
          sx={{ borderColor: "#E4E8F0", color: "#1A2035", paddingInline: "14px", fontSize: 13 }}
        >
          <AppIcon name="filters" size={14} /> Filters{" "}
          {filterCount > 0 ? (
            <Box
              component="span"
              sx={{
                ml: 0.75,
                background: "#F5A623",
                color: "#fff",
                borderRadius: "10px",
                px: 0.75,
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              {filterCount}
            </Box>
          ) : null}
        </AppButton>
      </PageToolbar>

      {/* Filter panel: matches #mgr-comp-filter-panel */}
      <FilterPanel open={props.showFilters} sx={{ marginBottom: "16px" }}>
          <Box
            className="filter-grid"
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3,minmax(0,1fr))",
              gap: "16px",
            }}
          >
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
            <FilterChipGroup
              label="User"
              options={props.userOptions}
              selected={props.userFilters}
              onToggle={props.setUserFilters}
              tone="blue"
            />
          </Box>
          <Box className="filter-actions" sx={{ mt: 2, pt: 2, borderTop: "1px solid #E4E8F0" }}>
            <AppButton
              type="button"
              size="small"
              variant="contained"
              color="error"
              onClick={props.clearFilters}
              sx={{ background: "#FEE2E2", color: "#EF4444", boxShadow: "none" }}
            >
              Clear All
            </AppButton>
          </Box>
      </FilterPanel>

      <AppTableShell>
        <AppTableHeader
          columnsTemplate="80px 130px 50px 1fr 80px 100px"
          columns={[
            { key: "level", label: "Level", sortable: true },
            { key: "trade", label: "Trade", sortable: true },
            { key: "user", label: "User", sortable: true },
            { key: "description", label: "Description", sortable: true },
            { key: "date", label: "Date", sortable: true },
            { key: "duration", label: "Duration", sortable: true },
          ]}
          sortKey={props.sortKey}
          sortDirection={props.sortDirection}
          onSort={(key) =>
            props.onSortColumn(
              key as "level" | "trade" | "user" | "description" | "date" | "duration",
            )
          }
        />

        <Box id="mgr-completed-rows">
          {initialLoading ? (
            <AppGridTableSkeleton columnsTemplate="80px 130px 50px 1fr 80px 100px" rowCount={8} />
          ) : props.rows.length === 0 ? (
            <AppTableEmptyState icon={<AppIcon name="complete" size={36} />} message="No completed tasks yet." />
          ) : (
            props.rows.map((task) => (
              <AppTableRow
                key={`${task.id}-${task.date}`}
                columnsTemplate="80px 130px 50px 1fr 80px 100px"
                className="completed-row"
                sx={{ gap: 0 }}
              >
                <AppTableCell variant="level">{task.level}</AppTableCell>
                <AppTableCell variant="trade">{task.trade}</AppTableCell>
                <InitialsBadge initials={task.user} />
                <AppTableCell variant="text">{htmlToPlainText(task.desc)}</AppTableCell>
                <AppTableCell variant="muted">{task.date}</AppTableCell>
                <DoneBadge label={`${task.durationDays}d`} />
              </AppTableRow>
            ))
          )}
        </Box>

        {props.total > props.pageSize ? (
          <AppTablePagination
            page={props.page}
            pageSize={props.pageSize}
            total={props.total}
            onChange={props.setPage}
            managerMode
          />
        ) : initialLoading ? (
          <Box sx={{ px: 2, py: 1.5 }}>
            <Skeleton variant="rounded" height={40} />
          </Box>
        ) : null}
      </AppTableShell>
    </>
  );
}

