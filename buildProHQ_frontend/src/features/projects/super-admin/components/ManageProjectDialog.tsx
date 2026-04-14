"use client";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { AppButton } from "@/components/common/AppButton";
import { PaginationBar } from "@/components/common/PaginationBar";
import { SearchInput } from "@/components/common/SearchInput";
import { AppTableCell } from "@/components/common/table/AppTableCell";
import { AppTableEmptyState } from "@/components/common/table/AppTableEmptyState";
import { AppTableHeader } from "@/components/common/table/AppTableHeader";
import { AppTableRow } from "@/components/common/table/AppTableRow";
import { AppTableShell } from "@/components/common/table/AppTableShell";
import { AppGridTableSkeleton } from "@/components/common/skeletons/AppGridTableSkeleton";
import { STYLE_TOKENS } from "@/constants/style-tokens";

export type ManageProjectDialogProject = {
  id: string;
  name: string;
  managers: number;
  trades: number;
  field: number;
  total: number;
};

export type ManageProjectDialogProps = {
  open: boolean;
  assignOpen: boolean;
  onClose: () => void;
  project: ManageProjectDialogProject | null;
  onOpenAssign: () => void;

  assignedListLoading: boolean;
  assignedMembers: Array<{ userId: string; fullName: string; email: string; roleCode: string }>;
  assigningUserId: string | null;
  onUnassign: (userId: string) => void;

  assignedMembersSearch: string;
  onAssignedMembersSearchChange: (v: string) => void;
  assignedMembersRole: "all" | "manager" | "trade_user" | "field_user";
  onAssignedMembersRoleChange: (v: "all" | "manager" | "trade_user" | "field_user") => void;

  assignedMembersTotal: number;
  assignedMembersPage: number;
  assignedMembersPageSize: number;
  onAssignedMembersPageChange: (p: number) => void;
};

const ASSIGNED_COLUMNS = "1fr 130px";

/**
 * Manage Project dialog (HTML-aligned) showing assigned users and entry point to Assign flow.
 * @param props - Project snapshot, assigned users list, filters, and handlers.
 * @returns MUI Dialog used to manage a project's memberships.
 */
export function ManageProjectDialog(props: ManageProjectDialogProps) {
  return (
    <Dialog
      open={props.open && !props.assignOpen}
      onClose={props.onClose}
      maxWidth="md"
      fullWidth
      slotProps={{ backdrop: { sx: { backgroundColor: "rgba(0,0,0,0.45)" } } }}
      PaperProps={{
        sx: {
          width: "min(920px, calc(100vw - 40px))",
          maxHeight: "min(680px, calc(100vh - 40px))",
          borderRadius: "16px",
          boxShadow: STYLE_TOKENS.shadow.lg,
          overflow: "hidden",
          margin: "20px",
        },
      }}
    >
      <Box
        sx={{
          padding: "16px 18px",
          borderBottom: `1px solid ${STYLE_TOKENS.colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontFamily: STYLE_TOKENS.typography.fontDisplay, fontSize: 22, fontWeight: 800 }}>
            Manage Project
          </Typography>
          <Typography sx={{ fontSize: 12.5, color: STYLE_TOKENS.colors.textMuted, marginTop: "2px" }}>
            Manage assignments (project-wise access)
          </Typography>
        </Box>
        <IconButton onClick={props.onClose} size="small">
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Box>

      <DialogContent sx={{ padding: "16px 18px", overflow: "auto" }}>
        <Stack spacing={2}>
          {/* SECTION 2: Stats pills + Assign button */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
              {[
                { label: "Managers", value: props.project?.managers ?? 0 },
                { label: "Trades", value: props.project?.trades ?? 0 },
                { label: "Field", value: props.project?.field ?? 0 },
                { label: "Total", value: props.project?.total ?? 0 },
              ].map((pill) => (
                <Box
                  key={pill.label}
                  sx={{
                    border: `1.5px solid ${STYLE_TOKENS.colors.border}`,
                    borderRadius: "999px",
                    padding: "6px 10px",
                    fontSize: 12,
                    fontWeight: 800,
                    fontFamily: STYLE_TOKENS.typography.fontDisplay,
                    color: STYLE_TOKENS.colors.text,
                    background: "#fff",
                  }}
                >
                  <Box component="strong" sx={{ fontFamily: STYLE_TOKENS.typography.fontDisplay, fontSize: 14 }}>
                    {pill.value}
                  </Box>{" "}
                  {pill.label}
                </Box>
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
              <AppButton size="small" onClick={props.onOpenAssign} sx={{ minWidth: 130 }}>
                ➕ Assign User
              </AppButton>
            </Box>
          </Box>

          {/* SECTION 3: Assigned users search + role chips */}
          <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap", alignItems: "center" }}>
            <Box sx={{ flex: 1, minWidth: 260 }}>
              <SearchInput value={props.assignedMembersSearch} placeholder="Search assigned users..." onChange={props.onAssignedMembersSearchChange} />
            </Box>
            <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", alignItems: "center", flexShrink: 0 }}>
              {(
                [
                  { key: "all", label: "All" },
                  { key: "manager", label: "Managers" },
                  { key: "trade_user", label: "Trades" },
                  { key: "field_user", label: "Field" },
                ] as const
              ).map((chip) => (
                <AppButton
                  key={chip.key}
                  type="button"
                  size="small"
                  variant={props.assignedMembersRole === chip.key ? "contained" : "outlined"}
                  onClick={() => props.onAssignedMembersRoleChange(chip.key)}
                  sx={{ minWidth: 92 }}
                >
                  {chip.label}
                </AppButton>
              ))}
            </Box>
          </Box>

          {/* SECTION 4: Assigned Users table */}
          <Box sx={{ marginTop: 2 }}>
            <AppTableShell>
              <AppTableHeader columnsTemplate={ASSIGNED_COLUMNS} columns={[{ key: "user", label: "Assigned user" }, { key: "actions", label: "Actions" }]} />

              {props.assignedListLoading ? (
                <AppGridTableSkeleton columnsTemplate={ASSIGNED_COLUMNS} rowCount={6} />
              ) : props.assignedMembers.length === 0 ? (
                <AppTableEmptyState message="No users match your search/filter." />
              ) : (
                <>
                  {props.assignedMembers.map((m) => {
                    const busy = props.assigningUserId === m.userId;
                    const role = m.roleCode.includes("management") ? "Manager" : m.roleCode.includes("trade") ? "Trade" : "Field";
                    return (
                      <AppTableRow key={m.userId} columnsTemplate={ASSIGNED_COLUMNS}>
                        <AppTableCell sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontSize: 13.5, fontWeight: 900, color: STYLE_TOKENS.colors.text }}>
                            {m.fullName} ({role})
                          </Typography>
                          <Typography sx={{ fontSize: 12.5, color: STYLE_TOKENS.colors.textMuted, marginTop: "2px" }}>
                            {m.email}
                          </Typography>
                        </AppTableCell>
                        <AppTableCell className="table-cell-actions">
                          <AppButton
                            variant="outlined"
                            size="small"
                            onClick={() => props.onUnassign(m.userId)}
                            disabled={busy}
                            sx={{
                              borderRadius: "10px",
                              background: "#FEE2E2",
                              borderColor: "#FECACA",
                              color: "#EF4444",
                              "&:hover": { background: "#FEE2E2", borderColor: "#EF4444" },
                              minWidth: 92,
                            }}
                          >
                            {busy ? "Removing…" : "Remove"}
                          </AppButton>
                        </AppTableCell>
                      </AppTableRow>
                    );
                  })}
                </>
              )}
            </AppTableShell>

            {props.assignedMembersTotal > props.assignedMembersPageSize ? (
              <PaginationBar
                page={props.assignedMembersPage}
                pageSize={props.assignedMembersPageSize}
                total={props.assignedMembersTotal}
                onChange={props.onAssignedMembersPageChange}
              />
            ) : null}
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

