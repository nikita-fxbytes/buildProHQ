"use client";

import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppButton } from "@/components/common/AppButton";
import { PaginationBar } from "@/components/common/PaginationBar";
import { SearchInput } from "@/components/common/SearchInput";
import { AppSelectField } from "@/components/common/AppSelectField";
import { AppTableCell } from "@/components/common/table/AppTableCell";
import { AppTableEmptyState } from "@/components/common/table/AppTableEmptyState";
import { AppTableHeader } from "@/components/common/table/AppTableHeader";
import { AppTableRow } from "@/components/common/table/AppTableRow";
import { AppTableShell } from "@/components/common/table/AppTableShell";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import type { UseFormReturn } from "react-hook-form";
import type { CreateProjectFormValues } from "@/schemas/project.schema";
import { CreateProjectDialog } from "@/features/projects/super-admin/components/CreateProjectDialog";
import { ManageProjectDialog } from "@/features/projects/super-admin/components/ManageProjectDialog";
import { AssignUsersDialog } from "@/features/projects/super-admin/components/AssignUsersDialog";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { AppIcon } from "@/components/common/AppIcon";

export type SuperProjectsSortColumn = "name" | "members";
export type SuperProjectsSortDirection = "asc" | "desc";
export type SuperProjectsSortPreset = "nameAsc" | "nameDesc" | "mostUsers" | "leastUsers";

export type SuperProjectRow = {
  id: string;
  name: string;
  managers: number;
  trades: number;
  field: number;
  total: number;
};

export type SuperProjectsHtmlViewProps = {
  /** True while rows are loading */
  loading: boolean;
  /** True only for the first load skeleton */
  initialLoading: boolean;

  page: number;
  pageSize: number; // fixed 10 in Step 2
  total: number;

  search: string;
  sortKey: SuperProjectsSortColumn | null;
  sortDirection: SuperProjectsSortDirection;
  sortPreset: SuperProjectsSortPreset;

  rows: SuperProjectRow[];

  onSearchChange: (v: string) => void;
  onSortColumn: (col: SuperProjectsSortColumn) => void;
  onSortPresetChange: (preset: SuperProjectsSortPreset) => void;
  onPageChange: (page: number) => void;

  delete: {
    open: boolean;
    project: SuperProjectRow | null;
    deleting: boolean;
    openModal: (project: SuperProjectRow) => void;
    closeModal: () => void;
    confirm: () => void;
  };

  create: {
    open: boolean;
    openModal: () => void;
    closeModal: () => void;
    form: UseFormReturn<CreateProjectFormValues>;
    submit: () => void;
    submitting: boolean;
  };

  manage: {
    open: boolean;
    openModal: (projectId: string) => void;
    closeModal: () => void;
    project: SuperProjectRow | null;
    membersRole: "manager" | "trade_user" | "field_user";
    setMembersRole: (v: "manager" | "trade_user" | "field_user") => void;
    usersLoading: boolean;
    users: Array<{
      id: string;
      full_name: string;
      email: string;
      initials: string | null;
      user_type_code: string;
      user_type_name: string;
    }>;
    usersMeta: { page: number; limit: number; total: number; totalPages: number };
    usersSearch: string;
    setUsersSearch: (v: string) => void;
    usersPage: number;
    setUsersPage: (p: number) => void;
    usersPageSize: number;
    usersSortKey: "name" | "email";
    usersSortDirection: "asc" | "desc";
    setUsersSort: (key: "name" | "email") => void;
    assignedUserIds: Set<string>;
    assignedListLoading: boolean;
    assignedMembers: Array<{ userId: string; fullName: string; email: string; roleCode: string }>;
    assignedMembersTotal: number;
    assignedMembersPage: number;
    assignedMembersPageSize: number;
    setAssignedMembersPage: (p: number) => void;
    assignedMembersSearch: string;
    setAssignedMembersSearch: (v: string) => void;
    assignedMembersRole: "all" | "manager" | "trade_user" | "field_user";
    setAssignedMembersRole: (v: "all" | "manager" | "trade_user" | "field_user") => void;
    assigningUserId: string | null;
    unassign: (userId: string) => void;
    openAssign: () => void;
    closeAssign: () => void;
    assignOpen: boolean;
    assignSearch: string;
    setAssignSearch: (v: string) => void;
    availableLoading: boolean;
    availableUsers: Array<{
      id: string;
      full_name: string;
      email: string;
      initials: string | null;
      user_type_code: string;
      user_type_name: string;
    }>;
    selectedAssignUsers: Array<{ value: string; label: string }>;
    setSelectedAssignUsers: (opts: Array<{ value: string; label: string }>) => void;
    assignSubmitting: boolean;
    assignSelected: () => Promise<void>;
  };
};

// Matches existing app table proportions (projects + 4 count columns + actions)
const COLUMNS_TEMPLATE = "1fr 120px 110px 110px 90px 120px";

export function SuperProjectsHtmlView(props: SuperProjectsHtmlViewProps) {
  const showPagination = props.total > props.pageSize;

  return (
    <Stack spacing={2}>
      <Box
        className="page-header"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "22px",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            className="page-heading"
            sx={{
              fontFamily: STYLE_TOKENS.typography.fontDisplay,
              fontSize: 26,
              fontWeight: 700,
              color: STYLE_TOKENS.colors.text,
            }}
          >
            Projects
          </Typography>
          <Typography className="page-subtext" sx={{ fontSize: 13, color: STYLE_TOKENS.colors.textMuted, marginTop: "2px" }}>
            Create projects and manage who can access them. Filters/users/tasks are project-wise.
          </Typography>
        </Box>

        <AppButton onClick={props.create.openModal} sx={{ paddingInline: "20px", paddingBlock: "9px", fontSize: 15 }}>
          ➕ Create Project
        </AppButton>
      </Box>

      <Box className="toolbar" sx={{ marginBottom: "14px !important" }}>
        <Box className="search-box" sx={{ flex: 1, minWidth: 220 }}>
          <SearchInput
            value={props.search}
            placeholder="Search projects..."
            onChange={props.onSearchChange}
          />
        </Box>
        <Box sx={{ width: { xs: "100%", sm: 240 } }}>
          <AppSelectField
            label="Sort"
            value={props.sortPreset}
            onChange={(e) => props.onSortPresetChange(e.target.value as SuperProjectsSortPreset)}
            options={[
              { value: "nameAsc", label: "Name (A→Z)" },
              { value: "nameDesc", label: "Name (Z→A)" },
              { value: "mostUsers", label: "Most users" },
              { value: "leastUsers", label: "Least users" },
            ]}
          />
        </Box>
      </Box>

      <AppTableShell>
        <AppTableHeader
          columnsTemplate={COLUMNS_TEMPLATE}
          columns={[
            { key: "name", label: "Project", sortable: true },
            { key: "managers", label: "Managers" },
            { key: "trades", label: "Trades" },
            { key: "field", label: "Field" },
            { key: "members", label: "Total", sortable: true, sortKey: "members" },
            { key: "actions", label: "Actions" },
          ]}
          sortKey={props.sortKey}
          sortDirection={props.sortDirection}
          onSort={(key) => props.onSortColumn(key as SuperProjectsSortColumn)}
        />

        {props.rows.length === 0 ? (
          <AppTableEmptyState icon={"🏗"} message="No projects found" />
        ) : (
          <>
            {props.rows.map((r) => (
              <AppTableRow key={r.id} columnsTemplate={COLUMNS_TEMPLATE}>
                <AppTableCell variant="level" sx={{ minWidth: 0, fontWeight: 800 }}>
                  {r.name}
                </AppTableCell>
                <AppTableCell variant="text" sx={{ textAlign: "center", fontWeight: 800 }}>
                  {r.managers}
                </AppTableCell>
                <AppTableCell variant="text" sx={{ textAlign: "center", fontWeight: 800 }}>
                  {r.trades}
                </AppTableCell>
                <AppTableCell variant="text" sx={{ textAlign: "center", fontWeight: 800 }}>
                  {r.field}
                </AppTableCell>
                <AppTableCell variant="text" sx={{ textAlign: "center", fontWeight: 900 }}>
                  {r.total}
                </AppTableCell>
                <AppTableCell className="table-cell-actions">
                  <Box sx={{ display: "inline-flex", gap: 0.5, alignItems: "center", justifyContent: "flex-end", width: "100%" }}>
                    <Tooltip title="Assign Users" arrow>
                      <IconButton
                        aria-label="Assign Users"
                        size="small"
                        onClick={() => props.manage.openModal(r.id)}
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
                        onClick={() => props.delete.openModal(r)}
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
            ))}
          </>
        )}

        {showPagination ? (
          <PaginationBar page={props.page} pageSize={props.pageSize} total={props.total} onChange={props.onPageChange} />
        ) : null}
      </AppTableShell>

      {/* UI shells only in Step 1 (no API wiring yet) */}
      <ConfirmModal
        open={props.delete.open}
        title="Delete Project"
        message="Are you sure you want to delete this project?"
        confirmLabel={props.delete.deleting ? "Deleting..." : "Delete"}
        confirmColor="error"
        onClose={props.delete.closeModal}
        onConfirm={props.delete.confirm}
      />

      <CreateProjectDialog
        open={props.create.open}
        submitting={props.create.submitting}
        form={props.create.form}
        onClose={props.create.closeModal}
        onSubmit={props.create.submit}
      />

      <ManageProjectDialog
        open={props.manage.open}
        assignOpen={props.manage.assignOpen}
        onClose={props.manage.closeModal}
        project={props.manage.project}
        onOpenAssign={props.manage.openAssign}
        assignedListLoading={props.manage.assignedListLoading}
        assignedMembers={props.manage.assignedMembers}
        assigningUserId={props.manage.assigningUserId}
        onUnassign={props.manage.unassign}
        assignedMembersSearch={props.manage.assignedMembersSearch}
        onAssignedMembersSearchChange={props.manage.setAssignedMembersSearch}
        assignedMembersRole={props.manage.assignedMembersRole}
        onAssignedMembersRoleChange={props.manage.setAssignedMembersRole}
        assignedMembersTotal={props.manage.assignedMembersTotal}
        assignedMembersPage={props.manage.assignedMembersPage}
        assignedMembersPageSize={props.manage.assignedMembersPageSize}
        onAssignedMembersPageChange={props.manage.setAssignedMembersPage}
      />

      <AssignUsersDialog
        open={props.manage.assignOpen}
        onClose={props.manage.closeAssign}
        search={props.manage.assignSearch}
        onSearchChange={props.manage.setAssignSearch}
        loading={props.manage.availableLoading}
        assignedUserIds={props.manage.assignedUserIds}
        availableUsers={props.manage.availableUsers}
        selected={props.manage.selectedAssignUsers}
        onSelectedChange={props.manage.setSelectedAssignUsers}
        submitting={props.manage.assignSubmitting}
        onAssign={props.manage.assignSelected}
      />
    </Stack>
  );
}

