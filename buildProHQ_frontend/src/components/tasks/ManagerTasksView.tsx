"use client";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppButton } from "@/components/common/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import { DaysBadge } from "@/components/common/badges/DaysBadge";
import { InitialsBadge } from "@/components/common/badges/InitialsBadge";
import { PriorityBadge } from "@/components/common/badges/PriorityBadge";
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
import { AppGridTableSkeleton } from "@/components/common/skeletons/AppGridTableSkeleton";
import { AppStatCardsSkeleton } from "@/components/common/skeletons/AppStatCardsSkeleton";
import { SearchInput } from "@/components/common/SearchInput";
import { StatCard } from "@/components/common/StatCard";
import { htmlToPlainText } from "@/utils/richText";

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
  sortDays: "asc" | "desc" | null;
  setSortDays: (dir: "asc" | "desc") => void;
  sortKey?: "level" | "trade" | "user" | "priority" | "description" | "daysOpen" | "createdAt" | null;
  sortDirection?: "asc" | "desc";
  onSortColumn?: (key: "level" | "trade" | "user" | "priority" | "description" | "daysOpen" | "createdAt") => void;
  selectedIds: string[];
  toggleSelected: (id: string) => void;
  clearSelected: () => void;
  openCompleteSelectedConfirm: () => void;
  openDeleteSelectedConfirm: () => void;
  openDeleteSingleConfirm: (task: { id: string; level: string; trade: string; user: string; priority: string; desc: string; days: number }) => void;
  confirmOpen: boolean;
  confirmTitle: string;
  confirmMessage: string;
  confirmLabel: string;
  confirmColor: "error" | "success" | "primary";
  closeConfirm: () => void;
  onConfirm: () => void;
  rows: Array<{ id: string; level: string; trade: string; user: string; priority: string; desc: string; days: number }>;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  stats: {
    totalOpen: number;
    overdue: number;
    completedStub: number;
    activeUsers: number;
  };
};

export function ManagerTasksView(props: Props) {
  const filterCount =
    props.tradeFilters.length +
    props.levelFilters.length +
    props.userFilters.length +
    (props.sortDays ? 1 : 0);
  const initialLoading = props.loading && props.rows.length === 0;

  return (
    <Stack spacing={2}>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
        {initialLoading ? (
          <AppStatCardsSkeleton count={4} />
        ) : (
          <>
            <StatCard value={props.stats.totalOpen} label="Total Open Tasks" accentColor="#F5A623" />
            <StatCard value={props.stats.overdue} label="Overdue (10+ days)" accentColor="#EF4444" />
            <StatCard value={props.stats.completedStub} label="Completed" accentColor="#22C55E" />
            <StatCard value={props.stats.activeUsers} label="Active Users" accentColor="#3BB0D8" />
          </>
        )}
      </Box>

      <PageToolbar>
        <Box sx={{ flex: 1, minWidth: 220 }}>
          <SearchInput
            value={props.search}
            placeholder="Search all tasks..."
            onChange={props.setSearch}
          />
        </Box>
        <AppButton
          type="button"
          variant="outlined"
          size="small"
          onClick={() => props.setShowFilters(!props.showFilters)}
          sx={{ borderColor: "#E4E8F0", color: "#1A2035" }}
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
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: "16px" }}>
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
                  <AppIcon name="sortAsc" size={12} /> Ascending
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
                  <AppIcon name="sortDesc" size={12} /> Descending
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
              <AppIcon name="complete" size={14} /> Complete
            </AppButton>
            <AppButton
              size="small"
              variant="contained"
              color="error"
              onClick={props.openDeleteSelectedConfirm}
              sx={{ background: "#FEE2E2", color: "#EF4444", boxShadow: "none" }}
            >
              <AppIcon name="delete" size={14} /> Delete
            </AppButton>
            <AppButton
              size="small"
              variant="outlined"
              onClick={props.clearSelected}
              sx={{ ml: "auto", borderColor: "#374151", color: "#9CA3AF" }}
            >
              Cancel
            </AppButton>
          </Stack>
        ) : null}

        <AppTableHeader
          columnsTemplate="36px 80px 130px 50px 80px 1fr 100px 36px"
          columns={[
            { key: "select", label: "" },
            { key: "level", label: "Level", sortable: true, sortKey: "level" },
            { key: "trade", label: "Trade", sortable: true, sortKey: "trade" },
            { key: "user", label: "User", sortable: true, sortKey: "user" },
            { key: "priority", label: "Priority", sortable: true, sortKey: "priority" },
            { key: "description", label: "Description", sortable: true, sortKey: "description" },
            { key: "daysOpen", label: "Days Open", sortable: true, sortKey: "daysOpen" },
            { key: "actions", label: "" },
          ]}
          sortKey={props.sortKey ?? null}
          sortDirection={props.sortDirection ?? "asc"}
          onSort={(key) => props.onSortColumn?.(key as any)}
          className="table-head mgmt"
        />

        {props.loading ? (
          <AppGridTableSkeleton
            columnsTemplate="36px 80px 130px 50px 80px 1fr 100px 36px"
            rowCount={8}
          />
        ) : props.rows.length === 0 ? (
          <AppTableEmptyState icon={<AppIcon name="folder" size={36} />} message="No tasks match your filters." />
        ) : (
          props.rows.map((task) => (
            <AppTableRow
              key={task.id}
              columnsTemplate="36px 80px 130px 50px 80px 1fr 100px 36px"
              className="task-row-item mgmt"
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
              <InitialsBadge initials={task.user} />
              <AppTableCell variant="default">
                <PriorityBadge label={task.priority} />
              </AppTableCell>
              <AppTableCell variant="text">{htmlToPlainText(task.desc)}</AppTableCell>
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
            onChange={props.onPageChange}
          />
        ) : initialLoading ? (
          <Box sx={{ px: "20px", py: "14px", borderTop: "1px solid #E4E8F0", background: "#FAFBFC" }}>
            <Skeleton variant="rounded" height={20} width="35%" />
          </Box>
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
