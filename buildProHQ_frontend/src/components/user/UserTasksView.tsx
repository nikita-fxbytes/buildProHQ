"use client";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppButton } from "@/components/common/AppButton";
import { DaysBadge } from "@/components/common/badges/DaysBadge";
import { PriorityBadge } from "@/components/common/badges/PriorityBadge";
import { AppIcon } from "@/components/common/AppIcon";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { FilterChipGroup } from "@/components/common/filters/FilterChipGroup";
import { FilterPanel } from "@/components/common/filters/FilterPanel";
import { AppTableCell } from "@/components/common/table/AppTableCell";
import { AppTableEmptyState } from "@/components/common/table/AppTableEmptyState";
import { AppTableHeader } from "@/components/common/table/AppTableHeader";
import { AppTablePagination } from "@/components/common/table/AppTablePagination";
import { AppTableRow } from "@/components/common/table/AppTableRow";
import { AppTableShell } from "@/components/common/table/AppTableShell";
import { PageToolbar } from "@/components/common/toolbar/PageToolbar";
import { SearchInput } from "@/components/common/SearchInput";
import { StatCard } from "@/components/common/StatCard";

type ActionItemRow = {
  id: string;
  level: string;
  trade: string;
  priority: string;
  desc: string;
  days: number;
};

type SortKey = "level" | "trade" | "priority" | "description" | "daysOpen" | "createdAt";

type Props = {
  loading: boolean;
  search: string;
  setSearch: (value: string) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  total: number;
  rows: ActionItemRow[];
  stats: {
    openTasks: number;
    overdue10: number;
    completed: number;
    tradesActive: number;
  };
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  tradeOptions: Array<string | { value: string; label: string }>;
  levelOptions: Array<string | { value: string; label: string }>;
  tradeFilters: string[];
  levelFilters: string[];
  setTradeFilters: (value: string) => void;
  setLevelFilters: (value: string) => void;
  sortDays: "asc" | "desc" | null;
  setSortDays: (dir: "asc" | "desc") => void;
  sortKey?: SortKey | null;
  sortDirection?: "asc" | "desc";
  onSortColumn?: (key: SortKey) => void;
  clearFilters: () => void;
  selectedIds: string[];
  toggleSelected: (id: string) => void;
  clearSelection: () => void;
  openCompleteSelectedConfirm: () => void;
  openDeleteSelectedConfirm: () => void;
  openDeleteSingleConfirm: (task: ActionItemRow) => void;
  confirmOpen: boolean;
  confirmTitle: string;
  confirmMessage: string;
  confirmLabel: string;
  confirmColor: "error" | "success" | "primary";
  closeConfirm: () => void;
  onConfirm: () => void;
};

export function UserTasksView(props: Props) {
  const filterCount =
    props.tradeFilters.length + props.levelFilters.length + (props.sortDays ? 1 : 0);

  return (
    <Stack spacing={2}>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
        <StatCard value={props.stats.openTasks} label="Open Tasks" accentColor="#F5A623" />
        <StatCard value={props.stats.overdue10} label="Overdue (10+ days)" accentColor="#EF4444" />
        <StatCard value={props.stats.completed} label="Completed" accentColor="#22C55E" />
        <StatCard value={props.stats.tradesActive} label="Trades Active" accentColor="#3BB0D8" />
      </Box>

      <PageToolbar>
        <Box sx={{ flex: 1, minWidth: 220 }}>
          <SearchInput
            value={props.search}
            placeholder="Search by level, trade, description..."
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
          {"\u2699"} Filters{" "}
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
      </PageToolbar>

      <FilterPanel open={props.showFilters}>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: "16px" }}>
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
            <Box>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: "#7B89A8", textTransform: "uppercase", mb: 1 }}>
                Sort by Days
              </Typography>
              <Stack direction="row" spacing={1}>
                <AppButton
                  type="button"
                  size="small"
                  variant="outlined"
                  onClick={() => props.setSortDays("asc")}
                  sx={{
                    borderColor: "#E4E8F0",
                    background: props.sortDays === "asc" ? "#F5A623" : "#fff",
                    color: props.sortDays === "asc" ? "#fff" : "#7B89A8",
                    fontSize: 12,
                  }}
                >
                  {"\u2191"} Ascending
                </AppButton>
                <AppButton
                  type="button"
                  size="small"
                  variant="outlined"
                  onClick={() => props.setSortDays("desc")}
                  sx={{
                    borderColor: "#E4E8F0",
                    background: props.sortDays === "desc" ? "#F5A623" : "#fff",
                    color: props.sortDays === "desc" ? "#fff" : "#7B89A8",
                    fontSize: 12,
                  }}
                >
                  {"\u2193"} Descending
                </AppButton>
              </Stack>
            </Box>
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
              Clear All
            </AppButton>
          </Box>
      </FilterPanel>

      <AppTableShell>
        {props.selectedIds.length > 0 ? (
          <Stack
            direction="row"
            spacing={1.25}
            alignItems="center"
            sx={{ padding: "10px 20px", background: "#1C2333" }}
          >
            <Typography sx={{ color: "#9CA3AF", fontSize: 13 }}>
              <strong style={{ color: "#fff" }}>{props.selectedIds.length}</strong> selected
            </Typography>
            <AppButton size="small" variant="contained" onClick={props.openCompleteSelectedConfirm}>
              {"\u2713"} Complete
            </AppButton>
            <AppButton
              size="small"
              variant="contained"
              color="error"
              onClick={props.openDeleteSelectedConfirm}
              sx={{ background: "#FEE2E2", color: "#EF4444", boxShadow: "none" }}
            >
              {"\uD83D\uDDD1"} Delete
            </AppButton>
            <AppButton
              size="small"
              variant="outlined"
              onClick={props.clearSelection}
              sx={{ ml: "auto", borderColor: "#374151", color: "#9CA3AF" }}
            >
              Cancel
            </AppButton>
          </Stack>
        ) : null}

        <AppTableHeader
          columnsTemplate="36px 80px 130px 80px 1fr 100px 36px"
          columns={[
            { key: "select", label: "" },
            { key: "level", label: "Level", sortable: true, sortKey: "level" },
            { key: "trade", label: "Trade", sortable: true, sortKey: "trade" },
            { key: "priority", label: "Priority", sortable: true, sortKey: "priority" },
            { key: "description", label: "Description", sortable: true, sortKey: "description" },
            { key: "daysOpen", label: "Days Open", sortable: true, sortKey: "daysOpen" },
            { key: "actions", label: "" },
          ]}
          sortKey={props.sortKey ?? null}
          sortDirection={props.sortDirection ?? "asc"}
          onSort={(key) => props.onSortColumn?.(key as SortKey)}
        />

        {props.loading ? (
          <Box sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 13, color: "#7B89A8" }}>Loading tasks...</Typography>
          </Box>
        ) : props.rows.length === 0 ? (
          <AppTableEmptyState icon={<AppIcon name="folder" size={36} />} message="No action items match your filters." />
        ) : (
          props.rows.map((task) => (
            <AppTableRow
              key={task.id}
              columnsTemplate="36px 80px 130px 80px 1fr 100px 36px"
              className="task-row-item"
            >
              <Box>
                <Checkbox
                  checked={props.selectedIds.includes(task.id)}
                  onChange={() => props.toggleSelected(task.id)}
                  size="small"
                  sx={{ p: 0 }}
                />
              </Box>
              <AppTableCell variant="level">{task.level}</AppTableCell>
              <AppTableCell variant="trade">{task.trade}</AppTableCell>
              <AppTableCell variant="default">
                <PriorityBadge label={task.priority} />
              </AppTableCell>
              <AppTableCell variant="text">{task.desc}</AppTableCell>
              <DaysBadge days={task.days} />
              <AppButton
                type="button"
                size="small"
                variant="contained"
                color="error"
                onClick={() => props.openDeleteSingleConfirm(task)}
                sx={{
                  padding: "4px 10px",
                  fontSize: 12,
                  minWidth: 0,
                  background: "#FEE2E2",
                  color: "#EF4444",
                  boxShadow: "none",
                  "&:hover": { background: "#EF4444", color: "#fff", boxShadow: "none" },
                }}
              >
                <AppIcon name="delete" size={14} />
              </AppButton>
            </AppTableRow>
          ))
        )}

        {props.total > props.pageSize ? (
          <AppTablePagination
            page={props.page}
            pageSize={props.pageSize}
            total={props.total}
            onChange={props.setPage}
          />
        ) : null}
      </AppTableShell>

      <ConfirmModal
        open={props.confirmOpen}
        title={props.confirmTitle}
        message={props.confirmMessage}
        confirmLabel={props.confirmLabel}
        confirmColor={props.confirmColor}
        onClose={props.closeConfirm}
        onConfirm={props.onConfirm}
      />
    </Stack>
  );
}

