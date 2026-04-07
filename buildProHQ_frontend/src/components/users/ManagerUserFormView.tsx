"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Controller, type UseFormReturn } from "react-hook-form";
import { AppAutocomplete } from "@/components/common/AppAutocomplete";
import { AppButton } from "@/components/common/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { FormTextField } from "@/components/common/FormTextField";
import { FormUploadField, type UploadItem } from "@/components/common/FormUploadField";
import { AvatarCropDialog } from "@/components/profile/AvatarCropDialog";
import type { UserFormValues } from "@/schemas/user.schema";

type RoleOption = { value: UserFormValues["role"]; label: string };
const ROLE_OPTIONS: RoleOption[] = [
  { value: "User", label: "Field User" },
  { value: "Trade", label: "Trade User" },
  { value: "Management", label: "Management" },
];

export type ManagerUserFormMode = "create" | "edit";

export type ManagerUserFormViewProps = {
  mode: ManagerUserFormMode;
  form: UseFormReturn<UserFormValues>;
  onSubmit: () => void;
  onCancel: () => void;
  loading: boolean;
  submitLabel: string;
  title: string;
  titleIcon: "add" | "edit";
  passwordHelperText: string;
  cropOpen: boolean;
  pendingFile: File | null;
  avatarItems: UploadItem[];
  onAvatarItemsChange: (items: UploadItem[]) => void;
  onCloseCrop: () => void;
  onCropped: (file: File) => void;
};

export function ManagerUserFormView({
  mode,
  form,
  onSubmit,
  onCancel,
  loading,
  submitLabel,
  title,
  titleIcon,
  passwordHelperText,
  cropOpen,
  pendingFile,
  avatarItems,
  onAvatarItemsChange,
  onCloseCrop,
  onCropped,
}: ManagerUserFormViewProps) {
  const avatarUrl = form.watch("avatarUrl") || "";

  return (
    <Box sx={{ maxWidth: "560px" }}>
      <Paper
        elevation={0}
        sx={{
          background: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          padding: "28px 32px",
          position: "relative",
        }}
      >
        {loading ? (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.7)",
              zIndex: 2,
              borderRadius: "12px",
            }}
          >
            <CircularProgress size={28} sx={{ color: "#F5A623" }} />
          </Box>
        ) : null}

        <Typography
          sx={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: "#1A2035",
            marginBottom: "14px",
            paddingBottom: "10px",
            borderBottom: "2px solid #E4E8F0",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <AppIcon name={titleIcon} size={18} /> {title}
        </Typography>

        <form onSubmit={onSubmit} noValidate>
          <Stack spacing={1.5}>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <FormFieldLabel required>Full Name</FormFieldLabel>
                  <FormTextField
                    {...field}
                    label=""
                    placeholder="e.g. John Smith"
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                </Box>
              )}
            />

            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <FormFieldLabel required>Email Address</FormFieldLabel>
                  <FormTextField
                    {...field}
                    label=""
                    placeholder="john@buildpro.com"
                    required
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                  />
                </Box>
              )}
            />

            <Controller
              control={form.control}
              name="role"
              render={({ field, fieldState }) => (
                <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <FormFieldLabel required>Role</FormFieldLabel>
                  <AppAutocomplete<RoleOption>
                    options={ROLE_OPTIONS}
                    value={ROLE_OPTIONS.find((o) => o.value === field.value) ?? null}
                    onChange={(opt) => field.onChange(opt?.value ?? "User")}
                    getOptionLabel={(o) => o.label}
                    isOptionEqualToValue={(a, b) => a.value === b.value}
                    textFieldProps={{
                      placeholder: "Select role",
                      error: !!fieldState.error,
                      helperText: fieldState.error?.message,
                    }}
                    sx={{ minWidth: 220 }}
                  />
                </Box>
              )}
            />

            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <FormFieldLabel>Password</FormFieldLabel>
                    <FormTextField
                      {...field}
                      type="password"
                      label=""
                      placeholder={mode === "edit" ? "Set password" : "Set password"}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  </Box>
                  <Typography sx={{ fontSize: "11px", color: "#7B89A8", marginTop: "2px" }}>
                    {passwordHelperText}
                  </Typography>
                </Box>
              )}
            />

            <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <FormFieldLabel>Profile Photo</FormFieldLabel>
              <FormUploadField mode="single" value={avatarItems} onChange={onAvatarItemsChange} maxSizeBytes={10 * 1024 * 1024} />
              {avatarUrl ? (
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.75 }}>
                  <Box
                    component="img"
                    src={avatarUrl}
                    alt="Profile photo preview"
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid #E4E8F0",
                    }}
                  />
                </Box>
              ) : null}
            </Box>
          </Stack>

          <Stack direction="row" spacing={1.25} sx={{ marginTop: "22px" }}>
            <AppButton
              type="submit"
              variant="contained"
              sx={{
                background: "#F5A623",
                color: "#ffffff",
                "&:hover": { background: "#E09010" },
              }}
            >
              {submitLabel}
            </AppButton>
            <AppButton
              type="button"
              variant="outlined"
              onClick={onCancel}
              sx={{
                borderColor: "#E4E8F0",
                color: "#1A2035",
                "&:hover": { borderColor: "#F5A623", color: "#F5A623" },
              }}
            >
              ← Cancel
            </AppButton>
          </Stack>
        </form>
      </Paper>

      <AvatarCropDialog open={cropOpen} file={pendingFile} onClose={onCloseCrop} onCropped={onCropped} />
    </Box>
  );
}

