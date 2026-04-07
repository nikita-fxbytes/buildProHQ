"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppIcon } from "@/components/common/AppIcon";
import { AppButton } from "@/components/common/AppButton";
import { RoleChip } from "@/components/common/badges/RoleChip";
import { FormSelectField } from "@/components/common/FormSelectField";
import { SearchInput } from "@/components/common/SearchInput";
import { AppGridTableSkeleton } from "@/components/common/skeletons/AppGridTableSkeleton";
import { AppTableCell } from "@/components/common/table/AppTableCell";
import { AppTableEmptyState } from "@/components/common/table/AppTableEmptyState";
import { AppTableHeader } from "@/components/common/table/AppTableHeader";
import { AppTablePagination } from "@/components/common/table/AppTablePagination";
import { AppTableRow } from "@/components/common/table/AppTableRow";
import { AppTableShell } from "@/components/common/table/AppTableShell";
import { PageToolbar } from "@/components/common/toolbar/PageToolbar";
import { ROUTES } from "@/constants/routes";
import type { ManagerUsersListItem } from "@/types/domain";

type RoleFilter = "" | "User" | "Trade" | "Management";

export type ManagerUsersListViewProps = {
  loading: boolean;
  rows: ManagerUsersListItem[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  roleFilter: RoleFilter;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: RoleFilter) => void;
  onPageChange: (page: number) => void;
};

const roleChip = (role: ManagerUsersListItem["role"]) =>
  role === "Trade"
    ? { text: "Trade User", tone: "trade" as const }
    : role === "Management"
      ? { text: "Management", tone: "mgmt" as const }
      : { text: "Field User", tone: "field" as const };

export function ManagerUsersListView({
  loading,
  rows,
  total,
  page,
  pageSize,
  search,
  roleFilter,
  onSearchChange,
  onRoleFilterChange,
  onPageChange,
}: ManagerUsersListViewProps) {
  return (
    <Stack spacing={2}>
      <PageToolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ flex: 1, maxWidth: 440 }}>
          <SearchInput
            value={search}
            placeholder="Search by name, email or role..."
            onChange={onSearchChange}
          />
        </Box>

        <Stack direction="row" gap={1} alignItems="center">
          <FormSelectField
            value={roleFilter}
            onChange={(event) => onRoleFilterChange(event.target.value as RoleFilter)}
            options={[
              { value: "", label: "All Roles" },
              { value: "User", label: "Field User" },
              { value: "Trade", label: "Trade User" },
              { value: "Management", label: "Management" },
            ]}
            sx={{
              minWidth: 170,
            }}
          />

          <AppButton
            component={Link}
            href={ROUTES.MANAGER_ADD_USER}
            variant="contained"
            sx={{
              background: "#F5A623",
              "&:hover": { background: "#E09010" },
            }}
          >
            <AppIcon name="add" size={14} /> Add User
          </AppButton>
        </Stack>
      </PageToolbar>

      <AppTableShell>
        <AppTableHeader
          columnsTemplate="44px 1fr 180px 110px 130px"
          cells={["", "Name", "Email", "Role", "Actions"]}
        />

        {loading ? (
          <AppGridTableSkeleton columnsTemplate="44px 1fr 180px 110px 130px" rowCount={8} />
        ) : rows.length === 0 ? (
          <AppTableEmptyState icon={<AppIcon name="folder" size={36} />} message="No users match your search." />
        ) : (
          rows.map((user) => {
            const chip = roleChip(user.role);
            return (
              <AppTableRow
                key={user.id}
                columnsTemplate="44px 1fr 180px 110px 130px"
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background:
                      user.role === "Trade"
                        ? "#16A34A"
                        : user.role === "Management"
                          ? "#2E3D5C"
                          : "#F5A623",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontFamily: "Rajdhani, sans-serif",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {user.initials}
                </Box>

                <Box>
                  <Typography className="table-cell-text" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </Typography>
                  {user.trade ? (
                    <Typography sx={{ fontSize: 11, color: "#7B89A8", marginTop: "2px" }}>
                      {user.trade}
                    </Typography>
                  ) : null}
                </Box>

                <AppTableCell variant="muted">{user.email}</AppTableCell>

                <RoleChip label={chip.text} tone={chip.tone} />

                <Stack direction="row" spacing={0.75}>
                  <AppButton
                    size="small"
                    variant="outlined"
                    component={Link}
                    href={`${ROUTES.MANAGER_USERS}/${user.id}/edit`}
                    sx={{
                      fontSize: 13,
                      padding: "6px 14px",
                      borderColor: "#E4E8F0",
                      color: "#1A2035",
                    }}
                  >
                    <AppIcon name="edit" size={13} /> Edit
                  </AppButton>
                </Stack>
              </AppTableRow>
            );
          })
        )}

        <AppTablePagination
          page={page}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          managerMode
        />
      </AppTableShell>
    </Stack>
  );
}
