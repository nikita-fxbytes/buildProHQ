"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AppButton } from "@/components/common/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import { DoneBadge } from "@/components/common/badges/DoneBadge";
import { InitialsBadge } from "@/components/common/badges/InitialsBadge";
import { FilterChipGroup } from "@/components/common/filters/FilterChipGroup";
import { FilterPanel } from "@/components/common/filters/FilterPanel";
import { PageSizeSelect } from "@/components/common/PageSizeSelect";
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
  id: number;
  level: string;
  trade: string;
  userLabel: string;
  desc: string;
  date: string;
  durationLabel: string;
};

type Props = {
  loading: boolean;
  search: string;
  setSearch: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  tradeOptions: string[];
  levelOptions: string[];
  userOptions: string[];
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
  setPageSize: (size: number) => void;
  total: number;
  rows: ManagerCompletedViewRow[];
};

export function ManagerCompletedView(props: Props) {
  const filterCount =
    props.tradeFilters.length + props.levelFilters.length + props.userFilters.length;

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
        <PageSizeSelect value={props.pageSize} onChange={props.setPageSize} />
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
          cells={["Level", "Trade", "User", "Description", "Date", "Duration"]}
        />

        <Box id="mgr-completed-rows">
          {props.loading ? (
            <Box sx={{ padding: "24px 20px" }}>
              <Typography sx={{ fontSize: 13, color: "#7B89A8" }}>
                Loading completed tasks...
              </Typography>
            </Box>
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
                <InitialsBadge initials={task.userLabel} />
                <AppTableCell variant="text">{htmlToPlainText(task.desc)}</AppTableCell>
                <AppTableCell variant="muted">{task.date}</AppTableCell>
                <DoneBadge label={task.durationLabel} />
              </AppTableRow>
            ))
          )}
        </Box>

        <AppTablePagination
          page={props.page}
          pageSize={props.pageSize}
          total={props.total}
          onChange={props.setPage}
          managerMode
        />
      </AppTableShell>
    </>
  );
}

