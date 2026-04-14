"use client";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import { AppButton } from "@/components/common/AppButton";
import { AppAutocomplete } from "@/components/common/AppAutocomplete";
import { STYLE_TOKENS } from "@/constants/style-tokens";

export type AssignUsersDialogProps = {
  open: boolean;
  onClose: () => void;
  search: string;
  onSearchChange: (v: string) => void;
  loading: boolean;
  assignedUserIds: Set<string>;
  availableUsers: Array<{ id: string; full_name: string; user_type_code: string }>;
  selected: Array<{ value: string; label: string }>;
  onSelectedChange: (opts: Array<{ value: string; label: string }>) => void;
  submitting: boolean;
  onAssign: () => void;
};

/**
 * Assign Users dialog that uses the shared autocomplete component.
 * @param props - Open state, available/selected users, and assign handlers.
 * @returns MUI Dialog used to assign users to a project.
 */
export function AssignUsersDialog(props: AssignUsersDialogProps) {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: `${STYLE_TOKENS.radius.modal}px`, boxShadow: STYLE_TOKENS.shadow.modal } }}
    >
      <DialogTitle sx={{ fontFamily: STYLE_TOKENS.typography.fontDisplay, fontWeight: 800 }}>
        Assign user to project
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <AppAutocomplete<{ value: string; label: string }, true>
            multiple
            options={props.availableUsers
              .filter((u) => !props.assignedUserIds.has(u.id))
              .map((u) => {
                const role =
                  u.user_type_code === "management" ? "Manager" : u.user_type_code === "trade_user" ? "Trade" : "Field";
                return { value: u.id, label: `${u.full_name} (${role})` };
              })}
            value={props.selected}
            onChange={props.onSelectedChange}
            label="Select users"
            placeholder="Search and select users..."
            onInputChange={(_, value) => props.onSearchChange(value)}
            loading={props.loading}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: "14px 18px" }}>
        <AppButton variant="outlined" onClick={props.onClose}>
          Cancel
        </AppButton>
        <AppButton onClick={props.onAssign} disabled={props.submitting || props.selected.length === 0} sx={{ minWidth: 110 }}>
          {props.submitting ? "Assigning…" : "Assign"}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}

