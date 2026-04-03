"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppIcon } from "@/components/common/AppIcon";
import { DoneBadge } from "@/components/common/badges/DoneBadge";
import { AppGridTableSkeleton } from "@/components/common/skeletons/AppGridTableSkeleton";
import { AppTableCell } from "@/components/common/table/AppTableCell";
import { AppTableEmptyState } from "@/components/common/table/AppTableEmptyState";
import { AppTableHeader } from "@/components/common/table/AppTableHeader";
import { AppTablePagination } from "@/components/common/table/AppTablePagination";
import { AppTableRow } from "@/components/common/table/AppTableRow";
import { AppTableShell } from "@/components/common/table/AppTableShell";
import { SearchInput } from "@/components/common/SearchInput";
import type { CompletedTask } from "@/types/domain";
import { formatIndianLongDate } from "@/utils/date";
import { htmlToPlainText } from "@/utils/richText";

type Props = {
  loading: boolean;
  search: string;
  setSearch: (value: string) => void;
  page: number;
  setPage: (page: number) => void;
  pageSize: number;
  total: number;
  rows: CompletedTask[];
};

export function TradeCompletedView(props: Props) {
  return (
    <Stack spacing={2}>
      <Box sx={{ width: "100%", maxWidth: 360 }}>
        <SearchInput
          value={props.search}
          placeholder="Search completed tasks..."
          onChange={props.setSearch}
        />
      </Box>

      <AppTableShell>
        <AppTableHeader
          columnsTemplate="80px 130px 1fr 100px 90px"
          cells={["Level", "Trade", "Description", "Date", "Duration"]}
        />

        {props.loading ? (
          <AppGridTableSkeleton columnsTemplate="80px 130px 1fr 100px 90px" rowCount={8} />
        ) : props.rows.length === 0 ? (
          <AppTableEmptyState icon={<AppIcon name="complete" size={36} />} message="No completed tasks found." />
        ) : (
          props.rows.map((task) => (
            <AppTableRow
              key={`${task.id}-${task.date}`}
              columnsTemplate="80px 130px 1fr 100px 90px"
            >
              <AppTableCell variant="level">{task.level}</AppTableCell>
              <AppTableCell variant="trade">{task.trade}</AppTableCell>
              <AppTableCell variant="text">{htmlToPlainText(task.desc)}</AppTableCell>
              <AppTableCell variant="muted">{formatIndianLongDate(task.date)}</AppTableCell>
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

