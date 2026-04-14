"use client";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import { Controller } from "react-hook-form";
import { AppButton } from "@/components/common/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { FormTextField } from "@/components/common/FormTextField";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import type { UseFormReturn } from "react-hook-form";
import type { CreateProjectFormValues } from "@/schemas/project.schema";

export type CreateProjectDialogProps = {
  open: boolean;
  submitting: boolean;
  form: UseFormReturn<CreateProjectFormValues>;
  onClose: () => void;
  onSubmit: () => void;
};

/**
 * Create Project dialog with standardized form controls.
 * @param props - RHF form, open state, submit/close handlers.
 * @returns MUI Dialog for creating a new project.
 */
export function CreateProjectDialog(props: CreateProjectDialogProps) {
  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
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
          borderBottom: `2px solid ${STYLE_TOKENS.colors.border}`,
          padding: "18px 20px",
        }}
      >
        <AppIcon name="add" size={18} /> Create Project
      </DialogTitle>
      <DialogContent sx={{ padding: "18px 20px" }}>
        <Stack spacing={1.5} sx={{ pt: 0.5 }}>
          <Controller
            control={props.form.control}
            name="name"
            render={({ field, fieldState }) => (
              <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <FormFieldLabel required>Project Name</FormFieldLabel>
                <FormTextField
                  {...field}
                  placeholder="Project Alpha — North Tower"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  disabled={props.submitting}
                />
              </Box>
            )}
          />
          <Controller
            control={props.form.control}
            name="code"
            render={({ field, fieldState }) => (
              <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <FormFieldLabel>Project Code (optional)</FormFieldLabel>
                <FormTextField
                  {...field}
                  placeholder="p1"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || "Use a short unique code (e.g. p1, alpha)."}
                  disabled={props.submitting}
                />
              </Box>
            )}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ padding: "0 20px 18px", gap: 1.25 }}>
        <AppButton variant="outlined" onClick={props.onClose} disabled={props.submitting}>
          Cancel
        </AppButton>
        <AppButton variant="contained" onClick={props.onSubmit} disabled={props.submitting} sx={{ minWidth: 160 }}>
          {props.submitting ? (
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={18} sx={{ color: "#fff" }} /> Creating...
            </Box>
          ) : (
            "Create Project"
          )}
        </AppButton>
      </DialogActions>
    </Dialog>
  );
}

