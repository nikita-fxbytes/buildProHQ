"use client";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { AppButton } from "@/components/common/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import { PriorityBadge } from "@/components/common/badges/PriorityBadge";
import { TaskStatusBadge } from "@/components/common/badges/TaskStatusBadge";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { FilterPanel } from "@/components/common/filters/FilterPanel";
import { FilterMultiSelect } from "@/components/common/filters/FilterMultiSelect";
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
import { STYLE_TOKENS } from "@/constants/style-tokens";
import { htmlToPlainText } from "@/utils/richText";
import { AppAutocomplete } from "@/components/common/AppAutocomplete";
import { TaskDaysToDueCell, TaskDeadlineDateCell } from "@/components/tasks/TaskDeadlineCells";

type Props = {
  addTaskHref?: string;
  showProjectColumn?: boolean;
  loading: boolean;
  search: string;
  setSearch: (value: string) => void;
  showFilters: boolean;
  setShowFilters: (value: boolean) => void;
  projectOptions?: Array<string | { value: string; label: string }>;
  tradeOptions: Array<string | { value: string; label: string }>;
  levelOptions: Array<string | { value: string; label: string }>;
  userOptions: Array<string | { value: string; label: string }>;
  projectFilters?: string[];
  tradeFilters: string[];
  levelFilters: string[];
  userFilters: string[];
  statusOptions?: Array<string | { value: string; label: string }>;
  statusFilters?: string[];
  priorityOptions?: Array<string | { value: string; label: string }>;
  priorityFilters?: string[];
  setProjectFilters?: (value: string) => void;
  setProjectFiltersDirect?: (value: string[]) => void;
  setTradeFilters: (value: string) => void;
  setTradeFiltersDirect?: (value: string[]) => void;
  setLevelFilters: (value: string) => void;
  setLevelFiltersDirect?: (value: string[]) => void;
  setUserFilters: (value: string) => void;
  setUserFiltersDirect?: (value: string[]) => void;
  setStatusFiltersDirect?: (value: string[]) => void;
  setStatusFilters?: (value: string) => void;
  setPriorityFiltersDirect?: (value: string[]) => void;
  setPriorityFilters?: (value: string) => void;
  clearFilters: () => void;
  sortDays: "asc" | "desc" | null;
  setSortDays: (dir: "asc" | "desc") => void;
  sortKey?:
    | "projectName"
    | "title"
    | "level"
    | "trade"
    | "user"
    | "assignees"
    | "priority"
    | "description"
    | "daysOpen"
    | "createdAt"
    | null;
  sortDirection?: "asc" | "desc";
  onSortColumn?: (key:
    | "projectName"
    | "title"
    | "level"
    | "trade"
    | "user"
    | "assignees"
    | "priority"
    | "description"
    | "daysOpen"
    | "createdAt") => void;
  selectedIds: string[];
  toggleSelected: (id: string) => void;
  clearSelected: () => void;
  openCompleteSelectedConfirm: () => void;
  openDeleteSelectedConfirm: () => void;
  openDeleteSingleConfirm: (task: {
    id: string;
    title: string;
    project: string | undefined;
    level: string;
    trade: string;
    user: string;
    assignees: string;
    assigneeIds: string[];
    priority: string;
    status: string;
    desc: string;
    days: number;
    dueAt: string | null;
    daysToDeadline: number | null;
  }) => void;
  confirmOpen: boolean;
  confirmTitle: string;
  confirmMessage: string;
  confirmLabel: string;
  confirmColor: "error" | "success" | "primary";
  closeConfirm: () => void;
  onConfirm: () => void;
  goToEdit: (taskId: string) => void;
  goToView?: (taskId: string) => void;
  showSuperTaskRoutes?: boolean;
  openAssign: (taskId: string, preselectIds?: string[]) => void;
  openStatusChange?: (taskId: string, currentStatusName?: string) => void;
  statusOpen?: boolean;
  statusValue?: string;
  setStatusValue?: (v: string) => void;
  statusSubmitting?: boolean;
  closeStatusChange?: () => void;
  saveStatusChange?: () => void;
  assignOpen: boolean;
  assignLoading: boolean;
  assignSubmitting: boolean;
  assignUserOptions: Array<{ value: string; label: string }>;
  assigneeUserIds: string[];
  setAssigneeUserIds: (v: string[]) => void;
  closeAssign: () => void;
  saveAssign: () => void;
  rows: Array<{
    id: string;
    title: string;
    project: string | undefined;
    level: string;
    trade: string;
    user: string;
    assignees: string;
    assigneeIds: string[];
    priority: string;
    status: string;
    desc: string;
    days: number;
    dueAt: string | null;
    daysToDeadline: number | null;
  }>;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  stats: {
    totalOpen: number;
    today: number;
    totalTasks: number;
  };
};

export function ManagerTasksView(props: Props) {
  type SortKey = NonNullable<Props["sortKey"]>;
  const statusOpts = props.statusOptions ?? [];
  const statusSel = props.statusFilters ?? [];
  const priorityOpts = props.priorityOptions ?? [];
  const prioritySel = props.priorityFilters ?? [];
  const filterCount =
    (props.showProjectColumn ? props.projectFilters?.length ?? 0 : 0) +
    props.tradeFilters.length +
    props.levelFilters.length +
    props.userFilters.length +
    statusSel.length +
    prioritySel.length +
    (props.sortDays ? 1 : 0);
  const initialLoading = props.loading && props.rows.length === 0;

  return (
    <Stack spacing={2}>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
        {initialLoading ? (
          <AppStatCardsSkeleton count={3} />
        ) : (
          <>
            <StatCard value={props.stats.totalOpen ?? 0} label="Open" accentColor="#F5A623" />
            <StatCard value={props.stats.today ?? 0} label="Today" accentColor="#22C55E" />
            <StatCard value={props.total ?? 0} label="Total Tasks" accentColor="#3BB0D8" />
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
        {props.addTaskHref ? (
          <AppButton
            href={props.addTaskHref}
            variant="contained"
            size="small"
            sx={{ mr: 1 }}
          >
            + Add Task
          </AppButton>
        ) : null}
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
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                statusOpts.length > 0 || priorityOpts.length > 0
                  ? props.showProjectColumn
                    ? "repeat(6,minmax(0,1fr))"
                    : "repeat(5,minmax(0,1fr))"
                  : props.showProjectColumn
                    ? "repeat(4,minmax(0,1fr))"
                    : "repeat(3,minmax(0,1fr))",
              gap: "16px",
            }}
          >
            {props.showProjectColumn ? (
              <FilterMultiSelect
                label="Project"
                options={props.projectOptions ?? []}
                selected={props.projectFilters ?? []}
                onChange={(next) => props.setProjectFiltersDirect?.(next)}
                placeholder="Search projects..."
              />
            ) : null}
            <FilterMultiSelect
              label="Trade"
              options={props.tradeOptions}
              selected={props.tradeFilters}
              onChange={(next) => props.setTradeFiltersDirect?.(next)}
              placeholder="Search trades..."
            />
            <FilterMultiSelect
              label="Level"
              options={props.levelOptions}
              selected={props.levelFilters}
              onChange={(next) => props.setLevelFiltersDirect?.(next)}
              placeholder="Search levels..."
            />
            <FilterMultiSelect
              label="User"
              options={props.userOptions}
              selected={props.userFilters}
              onChange={(next) => props.setUserFiltersDirect?.(next)}
              placeholder="Search users..."
              chipVariant="user"
            />
            {statusOpts.length > 0 ? (
              <FilterMultiSelect
                label="Status"
                options={statusOpts}
                selected={statusSel}
                onChange={(next) => props.setStatusFiltersDirect?.(next)}
                placeholder="Search status..."
              />
            ) : null}
            {priorityOpts.length > 0 ? (
              <FilterMultiSelect
                label="Priority"
                options={priorityOpts}
                selected={prioritySel}
                onChange={(next) => props.setPriorityFiltersDirect?.(next)}
                placeholder="Search priority..."
                chipVariant="priority"
              />
            ) : null}
            <Box sx={{ gridColumn: "1 / -1" }}>
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
          columnsTemplate={
            props.showProjectColumn
              ? "36px 170px 160px 1fr 80px 130px 160px 80px 110px 76px 104px 200px"
              : "36px 160px 1fr 80px 130px 160px 80px 110px 76px 104px 200px"
          }
          columns={[
            { key: "select", label: "" },
            ...(props.showProjectColumn
              ? [{ key: "project", label: "Project", sortable: true, sortKey: "projectName" } as const]
              : []),
            { key: "title", label: "Title", sortable: true, sortKey: "title" },
            { key: "description", label: "Description", sortable: true, sortKey: "description" },
            { key: "level", label: "Level", sortable: true, sortKey: "level" },
            { key: "trade", label: "Trade", sortable: true, sortKey: "trade" },
            { key: "assignees", label: "Assignees", sortable: true, sortKey: "assignees" },
            { key: "priority", label: "Priority", sortable: true, sortKey: "priority" },
            { key: "status", label: "Status", sortable: false },
            { key: "days", label: "Days", sortable: true, sortKey: "daysOpen" },
            { key: "deadline", label: "Deadline", sortable: false },
            { key: "actions", label: "Actions" },
          ]}
          sortKey={props.sortKey ?? null}
          sortDirection={props.sortDirection ?? "asc"}
          onSort={(key) => props.onSortColumn?.(key as SortKey)}
          className="table-head mgmt"
        />

        {props.loading ? (
          <AppGridTableSkeleton
            columnsTemplate={
              props.showProjectColumn
                ? "36px 170px 160px 1fr 80px 130px 160px 80px 110px 76px 104px 200px"
                : "36px 160px 1fr 80px 130px 160px 80px 110px 76px 104px 200px"
            }
            columnKinds={
              props.showProjectColumn
                ? [
                    "checkbox", // select
                    "text", // project
                    "text", // title
                    "text", // description
                    "text", // level
                    "text", // trade
                    "avatars", // assignees
                    "chip", // priority
                    "chip", // status
                    "text", // days
                    "date", // deadline
                    "icons", // actions
                  ]
                : [
                    "checkbox", // select
                    "text", // title
                    "text", // description
                    "text", // level
                    "text", // trade
                    "avatars", // assignees
                    "chip", // priority
                    "chip", // status
                    "text", // days
                    "date", // deadline
                    "icons", // actions
                  ]
            }
            rowCount={8}
          />
        ) : props.rows.length === 0 ? (
          <AppTableEmptyState icon={<AppIcon name="folder" size={36} />} message="No tasks match your filters." />
        ) : (
          props.rows.map((task) => (
            <AppTableRow
              key={task.id}
              columnsTemplate={
                props.showProjectColumn
                  ? "36px 170px 160px 1fr 80px 130px 160px 80px 110px 76px 104px 200px"
                  : "36px 160px 1fr 80px 130px 160px 80px 110px 76px 104px 200px"
              }
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
              {props.showProjectColumn ? (
                <AppTableCell variant="text">{task.project ?? "-"}</AppTableCell>
              ) : null}
              <AppTableCell variant="text">
                <Tooltip title="Open task" arrow disableHoverListener={!props.goToView}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: STYLE_TOKENS.colors.text,
                      cursor: props.goToView ? "pointer" : "default",
                      "&:hover": props.goToView ? { color: STYLE_TOKENS.colors.orange } : undefined,
                    }}
                    onClick={() => props.goToView?.(task.id)}
                  >
                    {task.title}
                  </Typography>
                </Tooltip>
              </AppTableCell>
              <AppTableCell variant="text">
                <Tooltip title={htmlToPlainText(task.desc)} arrow>
                  <Typography sx={{ fontSize: 13, color: STYLE_TOKENS.colors.text }}>
                    {(() => {
                      const plain = htmlToPlainText(task.desc);
                      return plain.length > 90 ? `${plain.slice(0, 90)}…` : plain;
                    })()}
                  </Typography>
                </Tooltip>
              </AppTableCell>
              <AppTableCell variant="level">{task.level}</AppTableCell>
              <AppTableCell variant="trade">{task.trade}</AppTableCell>
              <AppTableCell variant="text">
                <Typography sx={{ fontSize: 13, color: STYLE_TOKENS.colors.text }}>
                  {task.assignees}
                </Typography>
              </AppTableCell>
              <AppTableCell variant="default">
                <PriorityBadge label={task.priority} />
              </AppTableCell>
              <AppTableCell variant="default">
                <TaskStatusBadge label={task.status ?? "Open"} />
              </AppTableCell>
              <AppTableCell variant="default">
                <TaskDaysToDueCell daysToDeadline={task.daysToDeadline} />
              </AppTableCell>
              <AppTableCell variant="default">
                <TaskDeadlineDateCell dueAt={task.dueAt} />
              </AppTableCell>
              <Box
                className="table-cell-actions"
                sx={{
                  width: "100%",
                  display: "inline-flex",
                  justifyContent: "flex-end",
                  gap: 0.5,
                  alignItems: "center",
                }}
              >
                {props.showSuperTaskRoutes && props.goToView ? (
                  <Tooltip title="View Task" arrow>
                    <IconButton
                      aria-label="View Task"
                      size="small"
                      onClick={() => props.goToView?.(task.id)}
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: "8px",
                        border: `1.5px solid ${STYLE_TOKENS.colors.border}`,
                        color: STYLE_TOKENS.colors.text,
                        background: "#fff",
                        "&:hover": {
                          borderColor: STYLE_TOKENS.colors.orange,
                          color: STYLE_TOKENS.colors.orange,
                          background: "#fff",
                        },
                      }}
                    >
                      <AppIcon name="view" size={16} />
                    </IconButton>
                  </Tooltip>
                ) : null}
                {props.showSuperTaskRoutes && props.openStatusChange ? (
                  <Tooltip title="Change status" arrow>
                    <IconButton
                      aria-label="Change status"
                      size="small"
                      onClick={() => props.openStatusChange?.(task.id, task.status ?? "Open")}
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: "8px",
                        border: `1.5px solid ${STYLE_TOKENS.colors.border}`,
                        color: STYLE_TOKENS.colors.text,
                        background: "#fff",
                        "&:hover": {
                          borderColor: STYLE_TOKENS.colors.orange,
                          color: STYLE_TOKENS.colors.orange,
                          background: "#fff",
                        },
                      }}
                    >
                      <AppIcon name="status" size={16} />
                    </IconButton>
                  </Tooltip>
                ) : null}
                {props.showSuperTaskRoutes ? (
                  <Tooltip title="Edit Task" arrow>
                    <IconButton
                      aria-label="Edit Task"
                      size="small"
                      onClick={() => props.goToEdit(task.id)}
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: "8px",
                        border: `1.5px solid ${STYLE_TOKENS.colors.border}`,
                        color: STYLE_TOKENS.colors.text,
                        background: "#fff",
                        "&:hover": {
                          borderColor: STYLE_TOKENS.colors.orange,
                          color: STYLE_TOKENS.colors.orange,
                          background: "#fff",
                        },
                      }}
                    >
                      <AppIcon name="edit" size={16} />
                    </IconButton>
                  </Tooltip>
                ) : null}
                <Tooltip title="Assign" arrow>
                  <IconButton
                    aria-label="Assign"
                    size="small"
                    onClick={() => props.openAssign(task.id, task.assigneeIds ?? [])}
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "8px",
                      border: `1.5px solid ${STYLE_TOKENS.colors.border}`,
                      color: STYLE_TOKENS.colors.blue,
                      background: "#fff",
                      "&:hover": {
                        borderColor: STYLE_TOKENS.colors.blue,
                        color: STYLE_TOKENS.colors.blue,
                        background: "#fff",
                      },
                    }}
                  >
                    <AppIcon name="addUser" size={16} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete" arrow>
                  <IconButton
                    aria-label="Delete"
                    size="small"
                    onClick={() => props.openDeleteSingleConfirm(task)}
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "8px",
                      background: "#FEE2E2",
                      color: "#EF4444",
                      border: `1.5px solid ${STYLE_TOKENS.colors.border}`,
                      "&:hover": { background: "#EF4444", color: "#fff" },
                    }}
                  >
                    <AppIcon name="delete" size={16} />
                  </IconButton>
                </Tooltip>
              </Box>
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

      <Dialog open={props.assignOpen} onClose={props.closeAssign} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, fontSize: 16 }}>👤 Assign Task</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ mt: 1 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 800, color: STYLE_TOKENS.colors.textMuted, mb: 1 }}>
              Assign To
            </Typography>
            <Autocomplete<{ value: string; label: string }, true, false, false>
              multiple
              options={props.assignUserOptions}
              value={props.assignUserOptions.filter((o) => props.assigneeUserIds.includes(o.value))}
              onChange={(_, next) => props.setAssigneeUserIds(next.map((x) => x.value))}
              disableCloseOnSelect
              limitTags={2}
              getOptionLabel={(o) => o.label}
              isOptionEqualToValue={(a, b) => a.value === b.value}
              disabled={props.assignLoading || props.assignSubmitting}
              noOptionsText="No users found"
              renderOption={(liProps, option, { selected }) => {
                const { key, ...rest } = liProps;
                return (
                  <li key={key} {...rest}>
                    <Checkbox size="small" checked={selected} sx={{ mr: 1, p: 0 }} />
                    {option.label}
                  </li>
                );
              }}
              renderInput={(params) => (
                <TextField {...params} size="small" placeholder="Select users…" />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <AppButton
            type="button"
            variant="contained"
            onClick={props.saveAssign}
            disabled={props.assignLoading || props.assignSubmitting}
          >
            ✅ Assign
          </AppButton>
          <AppButton
            type="button"
            variant="outlined"
            onClick={props.closeAssign}
            disabled={props.assignLoading || props.assignSubmitting}
          >
            Cancel
          </AppButton>
        </DialogActions>
      </Dialog>

      <Dialog open={!!props.statusOpen} onClose={props.closeStatusChange} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, fontSize: 16 }}>Change Status</DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Box sx={{ mt: 1 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 800, color: STYLE_TOKENS.colors.textMuted, mb: 1 }}>
              Status
            </Typography>
            <AppAutocomplete<{ value: string; label: string }>
              options={[
                { value: "Open", label: "Open" },
                { value: "In Progress", label: "In Progress" },
                { value: "Completed", label: "Completed" },
              ]}
              value={
                [{ value: "Open", label: "Open" }, { value: "In Progress", label: "In Progress" }, { value: "Completed", label: "Completed" }].find(
                  (x) => x.value === (props.statusValue ?? "Open"),
                ) ?? { value: "Open", label: "Open" }
              }
              onChange={(opt) => props.setStatusValue?.(opt?.value ?? "Open")}
              getOptionLabel={(o) => o.label}
              isOptionEqualToValue={(a, b) => a.value === b.value}
              disabled={!!props.statusSubmitting}
              noOptionsText="No statuses found"
              textFieldProps={{ placeholder: "Select status…" }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <AppButton
            type="button"
            variant="contained"
            onClick={props.saveStatusChange}
            disabled={!!props.statusSubmitting}
          >
            Save
          </AppButton>
          <AppButton
            type="button"
            variant="outlined"
            onClick={props.closeStatusChange}
            disabled={!!props.statusSubmitting}
          >
            Cancel
          </AppButton>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
