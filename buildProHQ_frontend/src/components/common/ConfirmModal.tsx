import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import { AppButton } from "@/components/common/AppButton";
import { MESSAGES } from "@/constants/messages";
import { STYLE_TOKENS } from "@/constants/style-tokens";

export type ConfirmModalProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  /** Secondary action label (defaults to centralized cancel). */
  cancelLabel?: string;
  confirmColor?: "error" | "success" | "primary";
  icon?: ReactNode;
  onClose: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = MESSAGES.common.cancel,
  confirmColor = "error",
  icon = "⚠️",
  onClose,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: `${STYLE_TOKENS.radius.modal}px`,
          padding: "32px 36px",
          width: 400,
          maxWidth: "92vw",
          textAlign: "center",
          boxShadow: STYLE_TOKENS.shadow.modal,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: STYLE_TOKENS.typography.fontDisplay,
          fontSize: STYLE_TOKENS.typography.size.h4,
          fontWeight: 700,
          padding: 0,
          marginBottom: 0.5,
        }}
      >
        <Typography sx={{ fontSize: STYLE_TOKENS.typography.size.h2, mb: 0.5 }}>{icon}</Typography>
        {title}
      </DialogTitle>
      <DialogContent sx={{ padding: 0, marginBottom: 3, marginTop: 1 }}>
        <Typography sx={{ fontSize: STYLE_TOKENS.typography.size.body, color: STYLE_TOKENS.colors.textMuted }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 1.5,
          padding: 0,
        }}
      >
        <AppButton variant="outlined" onClick={onClose}>
          {cancelLabel}
        </AppButton>
        <AppButton variant="contained" color={confirmColor} onClick={onConfirm}>
          {confirmLabel}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}

