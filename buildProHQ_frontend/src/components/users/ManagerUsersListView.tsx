"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppIcon } from "@/components/common/AppIcon";
import { AppButton } from "@/components/common/AppButton";
import { RoleChip } from "@/components/common/badges/RoleChip";
import { AppAutocomplete } from "@/components/common/AppAutocomplete";
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
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { useState } from "react";

type RoleFilter = "" | "User" | "Trade" | "Management";

type RoleOption = { value: RoleFilter; label: string };

const ROLE_OPTIONS: RoleOption[] = [
  { value: "", label: "All Roles" },
  { value: "User", label: "Field User" },
  { value: "Trade", label: "Trade User" },
  { value: "Management", label: "Management" },
];

export type ManagerUsersListViewProps = {
  loading: boolean;
  rows: ManagerUsersListItem[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  roleFilter: RoleFilter;
  addUserHref?: string;
  editUserHref?: (id: string) => string;
  sortKey?: "createdAt" | "name" | "email" | "role" | "tasks" | "lastLoginAt" | null;
  sortDirection?: "asc" | "desc";
  onSortColumn?: (key: "createdAt" | "name" | "email" | "role" | "tasks" | "lastLoginAt") => void;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: RoleFilter) => void;
  onPageChange: (page: number) => void;
  removeUser: (id: string) => void;
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
  addUserHref = ROUTES.MANAGER_ADD_USER,
  editUserHref,
  sortKey,
  sortDirection,
  onSortColumn,
  onSearchChange,
  onRoleFilterChange,
  onPageChange,
  removeUser,
}: ManagerUsersListViewProps) {
  type SortKey = NonNullable<ManagerUsersListViewProps["sortKey"]>;
  const roleOptionValue = ROLE_OPTIONS.find((o) => o.value === roleFilter) ?? ROLE_OPTIONS[0];
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<{ id: string; name: string } | null>(null);
  const initialLoading = loading && rows.length === 0;

  return (
    <Stack spacing={2}>
      <PageToolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ flex: 1, minWidth: 260 }}>
          <SearchInput
            value={search}
            placeholder="Search by name, email or role..."
            onChange={onSearchChange}
          />
        </Box>

        <Stack direction="row" gap={1} alignItems="center" sx={{ flexShrink: 0 }}>
          <AppAutocomplete<RoleOption>
            options={ROLE_OPTIONS}
            value={roleOptionValue}
            onChange={(opt) => onRoleFilterChange(opt?.value ?? "")}
            getOptionLabel={(o) => o.label}
            isOptionEqualToValue={(a, b) => a.value === b.value}
            textFieldProps={{ placeholder: "All Roles" }}
            sx={{
              minWidth: 170,
            }}
          />

          <AppButton
            component={Link}
            href={addUserHref}
            variant="contained"
            sx={{ paddingInline: "18px", paddingBlock: "9px", fontSize: "15px", "&:hover": { transform: "translateY(-1px)" } }}
          >
            + Add User
          </AppButton>
        </Stack>
      </PageToolbar>

      <AppTableShell>
        <AppTableHeader
          columnsTemplate="44px 1fr 180px 110px 110px 130px"
          columns={[
            { key: "avatar", label: "" },
            { key: "name", label: "Name", sortable: true, sortKey: "name" },
            { key: "email", label: "Email", sortable: true, sortKey: "email" },
            { key: "role", label: "Role", sortable: true, sortKey: "role" },
            { key: "tasks", label: "Tasks", sortable: true, sortKey: "tasks" },
            { key: "actions", label: "" },
          ]}
          sortKey={sortKey ?? null}
          sortDirection={sortDirection ?? "asc"}
          onSort={(key) => onSortColumn?.(key as SortKey)}
          className="mgmt"
        />

        {loading ? (
          <AppGridTableSkeleton columnsTemplate="44px 1fr 180px 110px 110px 130px" rowCount={8} />
        ) : rows.length === 0 ? (
          <AppTableEmptyState icon={<AppIcon name="folder" size={36} />} message="No users match your search." />
        ) : (
          rows.map((user) => {
            const chip = roleChip(user.role);
            return (
              <AppTableRow
                key={user.id}
                columnsTemplate="44px 1fr 180px 110px 110px 130px"
                className="task-row-item mgmt"
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: user.avatarUrl
                      ? "transparent"
                      : user.role === "Trade"
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
                    overflow: "hidden",
                    border: user.avatarUrl ? "1.5px solid #E4E8F0" : "none",
                  }}
                >
                  {user.avatarUrl ? (
                    <Box
                      component="img"
                      src={user.avatarUrl}
                      alt={user.name}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    user.initials
                  )}
                </Box>

                <Box>
                  <AppTableCell variant="text" component="div" sx={{ fontWeight: 600 }}>
                    {user.name}
                  </AppTableCell>
                  {user.trade ? (
                    <Typography sx={{ fontSize: 11, color: "#7B89A8", marginTop: "2px" }}>
                      {user.trade}
                    </Typography>
                  ) : null}
                </Box>

                <AppTableCell variant="muted">{user.email}</AppTableCell>

                <RoleChip label={chip.text} tone={chip.tone} />

                <AppTableCell>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#1A2035" }}>
                    {(user.openTasks ?? 0).toString()} open
                  </Typography>
                </AppTableCell>

                <AppTableCell
                  component="div"
                  className="table-cell-actions"
                  sx={{ width: "100%" }}
                >
                  <Box sx={{ display: "inline-flex", gap: 0.5, alignItems: "center" }}>
                    <Tooltip title="Edit" arrow>
                      <IconButton
                        component={Link}
                        href={editUserHref ? editUserHref(String(user.id)) : `${ROUTES.MANAGER_USERS}/${user.id}/edit`}
                        aria-label="Edit"
                        size="small"
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: "8px",
                          border: "1.5px solid #E4E8F0",
                          color: "#1A2035",
                          background: "#fff",
                          "&:hover": {
                            borderColor: "#F5A623",
                            color: "#F5A623",
                            background: "#fff",
                          },
                        }}
                      >
                        <AppIcon name="edit" size={16} />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Remove" arrow>
                      <IconButton
                        aria-label="Remove"
                        size="small"
                        onClick={() => {
                          setPendingRemove({ id: String(user.id), name: user.name });
                          setConfirmOpen(true);
                        }}
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: "8px",
                          background: "#FEE2E2",
                          color: "#EF4444",
                          "&:hover": { background: "#EF4444", color: "#fff" },
                        }}
                      >
                        <AppIcon name="delete" size={16} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </AppTableCell>
              </AppTableRow>
            );
          })
        )}

        {total > pageSize ? (
          <AppTablePagination
            page={page}
            pageSize={pageSize}
            total={total}
            onChange={onPageChange}
            managerMode
          />
        ) : initialLoading ? (
          <Box sx={{ px: "20px", py: "14px", borderTop: "1px solid #E4E8F0", background: "#FAFBFC" }} />
        ) : null}
      </AppTableShell>

      <ConfirmModal
        open={confirmOpen}
        title="Remove User"
        message={
          pendingRemove?.name
            ? `Remove \"${pendingRemove.name}\" from users? This cannot be undone.`
            : "Remove this user? This cannot be undone."
        }
        confirmLabel="Yes, Remove"
        confirmColor="error"
        onClose={() => {
          setConfirmOpen(false);
          setPendingRemove(null);
        }}
        onConfirm={() => {
          if (!pendingRemove) return;
          removeUser(pendingRemove.id);
          setConfirmOpen(false);
          setPendingRemove(null);
        }}
      />
    </Stack>
  );
}
