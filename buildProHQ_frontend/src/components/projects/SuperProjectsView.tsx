"use client";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import { Controller, type UseFormReturn } from "react-hook-form";
import { AppButton } from "@/components/common/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import { SearchInput } from "@/components/common/SearchInput";
import { AppAutocomplete } from "@/components/common/AppAutocomplete";
import { AppGridTableSkeleton } from "@/components/common/skeletons/AppGridTableSkeleton";
import { AppTableCell } from "@/components/common/table/AppTableCell";
import { AppTableEmptyState } from "@/components/common/table/AppTableEmptyState";
import { AppTableHeader } from "@/components/common/table/AppTableHeader";
import { AppTablePagination } from "@/components/common/table/AppTablePagination";
import { AppTableRow } from "@/components/common/table/AppTableRow";
import { AppTableShell } from "@/components/common/table/AppTableShell";
import { PageToolbar } from "@/components/common/toolbar/PageToolbar";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { FormTextField } from "@/components/common/FormTextField";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import type { ProjectListItem } from "@/services/projectsApi.service";
import type { CreateProjectFormValues } from "@/schemas/project.schema";
import type { UserListItem } from "@/services/usersApi.service";

const COLUMNS_TEMPLATE = "1fr 120px 110px 110px 90px 120px";

export type SuperProjectsViewProps = {
  loading: boolean;
  initialLoading: boolean;
  rows: ProjectListItem[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  sortKey?: "name" | "members" | null;
  sortDirection?: "asc" | "desc";
  onSortColumn?: (key: "name" | "members") => void;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
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
    openModal: (project: ProjectListItem) => void;
    closeModal: () => void;
    project: ProjectListItem | null;
    membersLoading: boolean;
    members: Array<{
      userId: string;
      fullName: string;
      email: string;
      initials: string | null;
      roleCode: string;
      projectRole: string | null;
    }>;
    membersTotal: number;
    membersPage: number;
    membersPageSize: number;
    membersSearch: string;
    membersRole: "all" | "manager" | "trade_user" | "field_user";
    setMembersSearch: (v: string) => void;
    setMembersRole: (v: "all" | "manager" | "trade_user" | "field_user") => void;
    setMembersPage: (p: number) => void;
    availableLoading: boolean;
    availableUsers: UserListItem[];
    selectedUserId: string;
    setSelectedUserId: (id: string) => void;
    assignSelected: () => void;
    unassign: (userId: string) => void;
    assignOpen: boolean;
    openAssign: () => void;
    closeAssign: () => void;
  };
};

function avatarTone(roleCode: string): { bg: string; fg: string } {
  if (roleCode.includes("manager")) return { bg: "#3BB0D8", fg: "#fff" };
  if (roleCode.includes("trade")) return { bg: "#22C55E", fg: "#fff" };
  if (roleCode.includes("field")) return { bg: "#F5A623", fg: "#fff" };
  return { bg: "#EEF2FF", fg: "#3730A3" };
}

type ChipTone = "orange" | "blue" | "green";
function chipAccent(tone: ChipTone) {
  if (tone === "blue") return STYLE_TOKENS.colors.blue;
  if (tone === "green") return STYLE_TOKENS.colors.green;
  return STYLE_TOKENS.colors.orange;
}

function RoleFilterChip(props: {
  label: string;
  active: boolean;
  tone?: ChipTone;
  onClick: () => void;
}) {
  const accent = chipAccent(props.tone ?? "orange");
  return (
    <Box
      component="button"
      type="button"
      onClick={props.onClick}
      sx={{
        border: `1.5px solid ${props.active ? accent : STYLE_TOKENS.colors.border}`,
        background: props.active ? accent : "#fff",
        color: props.active ? "#fff" : STYLE_TOKENS.colors.text,
        borderRadius: "999px",
        padding: "6px 10px",
        fontSize: 12,
        fontWeight: 800,
        fontFamily: STYLE_TOKENS.typography.fontDisplay,
        cursor: "pointer",
        transition: "all 0.15s",
        "&:hover": props.active
          ? { background: accent, color: "#fff" }
          : { borderColor: accent, color: accent, background: "#fff" },
      }}
    >
      {props.label}
    </Box>
  );
}

export function SuperProjectsView(props: SuperProjectsViewProps) {
  type SortKey = NonNullable<SuperProjectsViewProps["sortKey"]>;

  return (
    <Stack spacing={2}>
      <PageToolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ flex: 1, minWidth: 260 }}>
          <SearchInput
            value={props.search}
            placeholder="Search by name or code..."
            onChange={props.onSearchChange}
          />
        </Box>

        <Box sx={{ flexShrink: 0 }}>
          <AppButton
            type="button"
            variant="contained"
            onClick={props.create.openModal}
            sx={{ paddingInline: "18px", paddingBlock: "9px", fontSize: "15px", "&:hover": { transform: "translateY(-1px)" } }}
          >
            + Create Project
          </AppButton>
        </Box>
      </PageToolbar>

      <AppTableShell>
        <AppTableHeader
          columnsTemplate={COLUMNS_TEMPLATE}
          columns={[
            { key: "name", label: "Project", sortable: true },
            { key: "membersManagers", label: "Managers" },
            { key: "membersTrades", label: "Trades" },
            { key: "membersField", label: "Field" },
            { key: "members", label: "Total", sortable: true, sortKey: "members" },
            { key: "actions", label: "Actions" },
          ]}
          sortKey={props.sortKey ?? undefined}
          sortDirection={props.sortDirection}
          onSort={(key) => props.onSortColumn?.(key as SortKey)}
          className="mgmt"
        />

        {props.initialLoading ? (
          <AppGridTableSkeleton columnsTemplate={COLUMNS_TEMPLATE} rowCount={8} />
        ) : props.rows.length === 0 ? (
          <AppTableEmptyState message="No projects found. Try adjusting your search." />
        ) : (
          <>
            {props.rows.map((p) => (
              <AppTableRow key={p.id} columnsTemplate={COLUMNS_TEMPLATE} className="mgmt">
                <AppTableCell variant="level" sx={{ minWidth: 0 }}>
                  {p.name}
                </AppTableCell>
                <AppTableCell variant="text" sx={{ fontWeight: 800 }}>
                  {p.membersManagers ?? 0}
                </AppTableCell>
                <AppTableCell variant="text" sx={{ fontWeight: 800 }}>
                  {p.membersTrades ?? 0}
                </AppTableCell>
                <AppTableCell variant="text" sx={{ fontWeight: 800 }}>
                  {p.membersField ?? 0}
                </AppTableCell>
                <AppTableCell variant="text" sx={{ fontWeight: 900 }}>
                  {p.membersTotal ?? 0}
                </AppTableCell>
                <AppTableCell className="table-cell-actions">
                  <AppButton variant="outlined" size="small" onClick={() => props.manage.openModal(p)}>
                    Manage
                  </AppButton>
                </AppTableCell>
              </AppTableRow>
            ))}
          </>
        )}

        <Box sx={{ pt: 1 }}>
          <AppTablePagination
            page={props.page}
            pageSize={props.pageSize}
            total={props.total}
            onChange={props.onPageChange}
            managerMode
          />
        </Box>
      </AppTableShell>

      <Dialog
        open={props.manage.open}
        onClose={props.manage.closeModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: `${STYLE_TOKENS.radius.modal}px`,
            boxShadow: STYLE_TOKENS.shadow.modal,
            overflow: "hidden",
          },
        }}
      >
        <DialogTitle
          sx={{
            padding: "22px 22px",
            borderBottom: `1px solid ${STYLE_TOKENS.colors.border}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontFamily: STYLE_TOKENS.typography.fontDisplay,
                  fontSize: 18,
                  fontWeight: 800,
                  color: STYLE_TOKENS.colors.text,
                  lineHeight: 1.1,
                }}
              >
                Project: {props.manage.project?.name ?? ""}
              </Typography>
              <Typography sx={{ fontSize: 12, color: STYLE_TOKENS.colors.textMuted, mt: 0.25 }}>
                Manage assignments (project-wise access)
              </Typography>
            </Box>
            <IconButton
              onClick={props.manage.closeModal}
              aria-label="Close"
              sx={{
                padding: "8px",
                borderRadius: "10px",
                "&:hover": { background: "#F3F4F6" },
              }}
            >
              <AppIcon name="close" size={16} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ padding: "28px 22px 22px", background: "#fff" }}>
          <Stack spacing={3}>
            <Box sx={{ display: "flex", gap: "12px", rowGap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              <AppButton variant="contained" size="small" onClick={props.manage.openAssign}>
                <AppIcon name="add" size={16} /> Assign User
              </AppButton>
              <Box sx={{ display: "flex", gap: "8px", rowGap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                <Box sx={{ border: `1.5px solid ${STYLE_TOKENS.colors.border}`, borderRadius: "999px", padding: "6px 10px", fontSize: 12, fontWeight: 800, fontFamily: STYLE_TOKENS.typography.fontDisplay, color: STYLE_TOKENS.colors.text, background: "#fff" }}>
                  <Box component="strong" sx={{ fontFamily: STYLE_TOKENS.typography.fontDisplay, fontSize: 14 }}>
                    {props.manage.project?.membersManagers ?? 0}
                  </Box>{" "}
                  Managers
                </Box>
                <Box sx={{ border: `1.5px solid ${STYLE_TOKENS.colors.border}`, borderRadius: "999px", padding: "6px 10px", fontSize: 12, fontWeight: 800, fontFamily: STYLE_TOKENS.typography.fontDisplay, color: STYLE_TOKENS.colors.text, background: "#fff" }}>
                  <Box component="strong" sx={{ fontFamily: STYLE_TOKENS.typography.fontDisplay, fontSize: 14 }}>
                    {props.manage.project?.membersTrades ?? 0}
                  </Box>{" "}
                  Trades
                </Box>
                <Box sx={{ border: `1.5px solid ${STYLE_TOKENS.colors.border}`, borderRadius: "999px", padding: "6px 10px", fontSize: 12, fontWeight: 800, fontFamily: STYLE_TOKENS.typography.fontDisplay, color: STYLE_TOKENS.colors.text, background: "#fff" }}>
                  <Box component="strong" sx={{ fontFamily: STYLE_TOKENS.typography.fontDisplay, fontSize: 14 }}>
                    {props.manage.project?.membersField ?? 0}
                  </Box>{" "}
                  Field
                </Box>
                <Box sx={{ border: `1.5px solid ${STYLE_TOKENS.colors.border}`, borderRadius: "999px", padding: "6px 10px", fontSize: 12, fontWeight: 800, fontFamily: STYLE_TOKENS.typography.fontDisplay, color: STYLE_TOKENS.colors.text, background: "#fff" }}>
                  <Box component="strong" sx={{ fontFamily: STYLE_TOKENS.typography.fontDisplay, fontSize: 14 }}>
                    {props.manage.project?.membersTotal ?? 0}
                  </Box>{" "}
                  Total
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap", alignItems: "center" }}>
              <Box sx={{ flex: 1, minWidth: 260 }}>
                <SearchInput
                  value={props.manage.membersSearch}
                  placeholder="Search assigned users..."
                  onChange={(v) => props.manage.setMembersSearch(v)}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", alignItems: "center", flexShrink: 0 }}>
                <RoleFilterChip
                  label="All"
                  active={props.manage.membersRole === "all"}
                  onClick={() => props.manage.setMembersRole("all")}
                />
                <RoleFilterChip
                  label="Managers"
                  tone="blue"
                  active={props.manage.membersRole === "manager"}
                  onClick={() => props.manage.setMembersRole("manager")}
                />
                <RoleFilterChip
                  label="Trades"
                  tone="green"
                  active={props.manage.membersRole === "trade_user"}
                  onClick={() => props.manage.setMembersRole("trade_user")}
                />
                <RoleFilterChip
                  label="Field"
                  tone="orange"
                  active={props.manage.membersRole === "field_user"}
                  onClick={() => props.manage.setMembersRole("field_user")}
                />
              </Box>
            </Box>

            {props.manage.membersLoading ? (
              <Stack spacing={1}>
                {Array.from({ length: 6 }).map((_, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      border: `1.5px solid ${STYLE_TOKENS.colors.border}`,
                      borderRadius: "14px",
                      padding: "14px 16px",
                      background: "#fff",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                      <Box sx={{ width: 42, height: 42, borderRadius: "50%", background: "#EEF2FF" }} />
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ height: 12, width: "40%", background: "#F3F5F9", borderRadius: 999 }} />
                        <Box sx={{ height: 10, width: "28%", background: "#F3F5F9", borderRadius: 999, mt: 1 }} />
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Stack>
            ) : props.manage.members.length === 0 ? (
              <Typography sx={{ padding: "8px 2px", color: STYLE_TOKENS.colors.textMuted, fontSize: 12, fontWeight: 600 }}>
                No users match your search/filter.
              </Typography>
            ) : (
              <Stack spacing={1.25} sx={{ mt: 0.5 }}>
                {props.manage.members.map((m) => {
                  const tone = avatarTone(m.roleCode || "");
                  return (
                    <Box
                      key={m.userId}
                      sx={{
                        border: `1.5px solid ${STYLE_TOKENS.colors.border}`,
                        borderRadius: "12px",
                        padding: "10px 12px",
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "12px",
                        transition: "all 0.15s",
                        "&:hover": {
                          borderColor: STYLE_TOKENS.colors.orange,
                          background: "#FAFBFF",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 280 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: tone.bg,
                            color: tone.fg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontFamily: STYLE_TOKENS.typography.fontDisplay,
                            fontWeight: 900,
                            fontSize: 14,
                            flexShrink: 0,
                          }}
                        >
                          {(m.initials || "?").slice(0, 2).toUpperCase()}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontSize: 13.5, fontWeight: 900, color: STYLE_TOKENS.colors.text }}>
                            {m.fullName}
                          </Typography>
                          <Typography sx={{ fontSize: 12.5, color: STYLE_TOKENS.colors.textMuted }}>
                            {m.email}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ flex: 1, minWidth: 220 }}>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
                          <Box
                            sx={{
                              border: `1.5px solid ${STYLE_TOKENS.colors.border}`,
                              borderRadius: "999px",
                              padding: "6px 12px",
                              fontSize: 12,
                              fontWeight: 900,
                              fontFamily: STYLE_TOKENS.typography.fontDisplay,
                              color: STYLE_TOKENS.colors.text,
                              background: "#fff",
                            }}
                          >
                            0 Open
                          </Box>
                          <Box
                            sx={{
                              border: `1.5px solid ${STYLE_TOKENS.colors.border}`,
                              borderRadius: "999px",
                              padding: "6px 12px",
                              fontSize: 12,
                              fontWeight: 900,
                              fontFamily: STYLE_TOKENS.typography.fontDisplay,
                              color: STYLE_TOKENS.colors.text,
                              background: "#fff",
                            }}
                          >
                            0 Completed
                          </Box>
                        </Box>
                        <Typography sx={{ fontSize: 12.5, color: "#90A0C5", mt: 0.75, textAlign: "center" }}>
                          Assigned to this project.
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, alignItems: "flex-end" }}>
                        <AppButton variant="outlined" size="small" disabled sx={{ borderRadius: "10px" }}>
                          Details
                        </AppButton>
                        <AppButton
                          variant="outlined"
                          size="small"
                          onClick={() => props.manage.unassign(m.userId)}
                          sx={{
                            borderRadius: "10px",
                            background: "#FEE2E2",
                            borderColor: "#FECACA",
                            color: "#EF4444",
                            "&:hover": { background: "#FEE2E2", borderColor: "#EF4444" },
                          }}
                        >
                          Remove
                        </AppButton>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            )}

            <Box sx={{ pt: 0.5 }}>
              <AppTablePagination
                page={props.manage.membersPage}
                pageSize={props.manage.membersPageSize}
                total={props.manage.membersTotal}
                onChange={props.manage.setMembersPage}
                managerMode
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ padding: "0 20px 18px" }} />
      </Dialog>

      <Dialog
        open={props.manage.assignOpen}
        onClose={props.manage.closeAssign}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: `${STYLE_TOKENS.radius.modal}px`,
            boxShadow: STYLE_TOKENS.shadow.modal,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: STYLE_TOKENS.typography.fontDisplay,
            fontSize: STYLE_TOKENS.typography.size.h4,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            borderBottom: "2px solid #E4E8F0",
            padding: "18px 20px",
          }}
        >
          Assign user to project
          <IconButton onClick={props.manage.closeAssign} aria-label="Close">
            <AppIcon name="close" size={16} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: "18px 20px" }}>
          <Stack spacing={1.5}>
            <AppAutocomplete<UserListItem>
              options={props.manage.availableUsers}
              value={props.manage.availableUsers.find((u) => u.id === props.manage.selectedUserId) ?? null}
              onChange={(u) => props.manage.setSelectedUserId(u?.id ?? "")}
              getOptionLabel={(u) => `${u.full_name} (${u.email})`}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              noOptionsText={props.manage.availableLoading ? "Loading..." : "No available users"}
              textFieldProps={{ placeholder: "Select user..." }}
              sx={{ minWidth: 280 }}
            />
            <Typography sx={{ fontSize: 12.5, color: STYLE_TOKENS.colors.textMuted }}>
              Only users not already assigned are shown.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ padding: "0 20px 18px", gap: 1.25 }}>
          <AppButton variant="outlined" onClick={props.manage.closeAssign}>
            Cancel
          </AppButton>
          <AppButton
            variant="contained"
            onClick={async () => {
              await props.manage.assignSelected();
              props.manage.closeAssign();
            }}
            disabled={props.manage.availableLoading || !props.manage.selectedUserId}
            sx={{ minWidth: 140 }}
          >
            Assign
          </AppButton>
        </DialogActions>
      </Dialog>

      <Dialog
        open={props.create.open}
        onClose={props.create.closeModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: `${STYLE_TOKENS.radius.modal}px`,
            boxShadow: STYLE_TOKENS.shadow.modal,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontFamily: STYLE_TOKENS.typography.fontDisplay,
            fontSize: STYLE_TOKENS.typography.size.h4,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderBottom: "2px solid #E4E8F0",
            padding: "18px 20px",
          }}
        >
          <AppIcon name="add" size={18} /> Create Project
        </DialogTitle>
        <DialogContent sx={{ padding: "18px 20px" }}>
          <Stack spacing={1.5} sx={{ pt: 0.5 }}>
            <Controller
              control={props.create.form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <FormFieldLabel required>Project Name</FormFieldLabel>
                  <FormTextField
                    {...field}
                    placeholder="Project Alpha — North Tower"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                </Box>
              )}
            />
            <Controller
              control={props.create.form.control}
              name="code"
              render={({ field, fieldState }) => (
                <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <FormFieldLabel>Project Code (optional)</FormFieldLabel>
                  <FormTextField
                    {...field}
                    placeholder="p1"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || "Use a short unique code (e.g. p1, alpha)."}
                  />
                </Box>
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ padding: "0 20px 18px", gap: 1.25 }}>
          <AppButton variant="outlined" onClick={props.create.closeModal} disabled={props.create.submitting}>
            Cancel
          </AppButton>
          <AppButton
            variant="contained"
            onClick={props.create.submit}
            disabled={props.create.submitting}
            sx={{ minWidth: 160 }}
          >
            {props.create.submitting ? (
              <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
                <CircularProgress size={18} sx={{ color: "#fff" }} /> Creating...
              </Box>
            ) : (
              "Create Project"
            )}
          </AppButton>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

