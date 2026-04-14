"use client";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { AppButton } from "@/components/common/AppButton";
import { STYLE_TOKENS } from "@/constants/style-tokens";

export type DeleteProjectDialogProps = {
  open: boolean;
  projectName?: string | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

/**
 * Confirmation dialog for deleting a project.
 * @param props - Dialog state, selected project name, and handlers.
 * @returns MUI Dialog asking the user to confirm deletion.
 */
export function DeleteProjectDialog(props: DeleteProjectDialogProps) {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      maxWidth="xs"
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
          borderBottom: `2px solid ${STYLE_TOKENS.colors.border}`,
          padding: "18px 20px",
        }}
      >
        Delete Project
        <IconButton onClick={props.onClose} disabled={props.deleting} size="small">
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: "18px 20px" }}>
        <Typography sx={{ fontWeight: 600, color: STYLE_TOKENS.colors.textMuted }}>
          Are you sure you want to delete this project?
        </Typography>
        {props.projectName ? (
          <Typography sx={{ mt: 1, fontWeight: 800, color: STYLE_TOKENS.colors.text }}>
            {props.projectName}
          </Typography>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ padding: "0 20px 18px", gap: 1.25 }}>
        <AppButton variant="outlined" onClick={props.onClose} disabled={props.deleting}>
          Cancel
        </AppButton>
        <AppButton variant="contained" color="error" onClick={props.onConfirm} disabled={props.deleting}>
          {props.deleting ? <CircularProgress size={18} sx={{ color: "inherit" }} /> : "Delete"}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}

