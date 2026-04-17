"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
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
import { AppGridTableSkeleton } from "@/components/common/skeletons/AppGridTableSkeleton";
import { AppStatCardsSkeleton } from "@/components/common/skeletons/AppStatCardsSkeleton";
import { SearchInput } from "@/components/common/SearchInput";
import { StatCard } from "@/components/common/StatCard";
import type { TradePortalTask } from "@/types/domain";
import { htmlToPlainText, truncateRichPlainText } from "@/utils/richText";

type Props = {
  loading: boolean;
  search: string;
  setSearch: (value: string) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  total: number;
  rows: TradePortalTask[];
  stats: {
    assigned: number;
    overdue: number;
    completed: number;
  };
  confirmOpen: boolean;
  pendingTask: TradePortalTask | null;
  askComplete: (task: TradePortalTask) => void;
  closeConfirm: () => void;
  confirmComplete: () => void;
};

export function TradeTasksView(props: Props) {
  return (
    <Stack spacing={2}>
      {props.loading ? (
        <AppStatCardsSkeleton count={3} />
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "16px" }}>
          <StatCard value={props.stats.assigned} label="Assigned Tasks" accentColor="#F5A623" />
          <StatCard value={props.stats.overdue} label="Overdue (10+ days)" accentColor="#EF4444" />
          <StatCard value={props.stats.completed} label="Completed" accentColor="#22C55E" />
        </Box>
      )}

      <Box sx={{ width: "100%", maxWidth: 360 }}>
        <SearchInput
          value={props.search}
          placeholder="Search assigned tasks..."
          onChange={props.setSearch}
        />
      </Box>

      <AppTableShell>
        <AppTableHeader
          columnsTemplate="180px 1fr 110px 130px"
          cells={["Filters", "Description", "Days Open", "Action"]}
        />

        {props.loading ? (
          <AppGridTableSkeleton columnsTemplate="180px 1fr 110px 130px" rowCount={8} />
        ) : props.rows.length === 0 ? (
          <AppTableEmptyState icon={<AppIcon name="folder" size={36} />} message="No assigned tasks found." />
        ) : (
          props.rows.map((task) => (
            <AppTableRow
              key={task.id}
              columnsTemplate="180px 1fr 110px 130px"
            >
              <AppTableCell variant="text">{task.filters}</AppTableCell>
              <AppTableCell variant="text">{htmlToPlainText(task.desc)}</AppTableCell>
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
            ? `Mark "${truncateRichPlainText(props.pendingTask.desc, 120)}" as completed?`
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

