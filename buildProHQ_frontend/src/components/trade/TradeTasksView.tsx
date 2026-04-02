"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppButton } from "@/components/common/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import { DaysBadge } from "@/components/common/badges/DaysBadge";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { AppTableCell } from "@/components/common/table/AppTableCell";
import { AppTableEmptyState } from "@/components/common/table/AppTableEmptyState";
import { AppTableHeader } from "@/components/common/table/AppTableHeader";
import { AppTablePagination } from "@/components/common/table/AppTablePagination";
import { AppTableRow } from "@/components/common/table/AppTableRow";
import { AppTableShell } from "@/components/common/table/AppTableShell";
import { SearchInput } from "@/components/common/SearchInput";
import { StatCard } from "@/components/common/StatCard";
import type { Task } from "@/types/domain";

type Props = {
  loading: boolean;
  search: string;
  setSearch: (value: string) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  total: number;
  rows: Task[];
  stats: {
    assigned: number;
    overdue: number;
    completed: number;
  };
  confirmOpen: boolean;
  pendingTask: Task | null;
  askComplete: (task: Task) => void;
  closeConfirm: () => void;
  confirmComplete: () => void;
};

export function TradeTasksView(props: Props) {
  return (
    <Stack spacing={2}>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
        <StatCard value={props.stats.assigned} label="Assigned Tasks" accentColor="#F5A623" />
        <StatCard value={props.stats.overdue} label="Overdue (10+ days)" accentColor="#EF4444" />
        <StatCard value={props.stats.completed} label="Completed" accentColor="#22C55E" />
      </Box>

      <Box sx={{ width: "100%", maxWidth: 360 }}>
        <SearchInput
          value={props.search}
          placeholder="Search assigned tasks..."
          onChange={props.setSearch}
        />
      </Box>

      <AppTableShell>
        <AppTableHeader
          columnsTemplate="80px 130px 1fr 110px 130px"
          cells={["Level", "Trade", "Description", "Days Open", "Action"]}
        />

        {props.loading ? (
          <Box sx={{ p: 3 }}>
            <Typography sx={{ fontSize: 13, color: "#7B89A8" }}>Loading tasks...</Typography>
          </Box>
        ) : props.rows.length === 0 ? (
          <AppTableEmptyState icon={<AppIcon name="folder" size={36} />} message="No assigned tasks found." />
        ) : (
          props.rows.map((task) => (
            <AppTableRow
              key={task.id}
              columnsTemplate="80px 130px 1fr 110px 130px"
            >
              <AppTableCell variant="level">{task.level}</AppTableCell>
              <AppTableCell variant="trade">{task.trade}</AppTableCell>
              <AppTableCell variant="text">{task.desc}</AppTableCell>
              <DaysBadge days={task.days} />
              <AppButton
                type="button"
                size="small"
                variant="contained"
                color="success"
                onClick={() => props.askComplete(task)}
                sx={{
                  minWidth: 108,
                  padding: "6px 10px",
                  fontSize: 12,
                  lineHeight: 1,
                }}
              >
                <AppIcon name="complete" size={14} /> Complete
              </AppButton>
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

      <ConfirmModal
        open={props.confirmOpen}
        title="Confirm Complete"
        message={
          props.pendingTask
            ? `Mark "${props.pendingTask.desc}" as completed?`
            : "Mark this task as completed?"
        }
        confirmLabel="Complete"
        icon={<AppIcon name="complete" size={30} />}
        confirmColor="success"
        onClose={props.closeConfirm}
        onConfirm={props.confirmComplete}
      />
    </Stack>
  );
}

