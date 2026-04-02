"use client";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { Controller, type UseFormReturn } from "react-hook-form";
import { AppIcon } from "@/components/common/AppIcon";
import { AppButton } from "@/components/common/AppButton";
import { FormSelectField } from "@/components/common/FormSelectField";
import { FormTextField } from "@/components/common/FormTextField";
import type { UserFormValues } from "@/schemas/user.schema";

export type ManagerEditUserViewProps = {
  form: UseFormReturn<UserFormValues>;
  onSubmit: () => void;
  onCancel: () => void;
};

export function ManagerEditUserView({ form, onSubmit, onCancel }: ManagerEditUserViewProps) {
  return (
    <Box sx={{ maxWidth: "560px" }}>
      <Typography
        sx={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: "22px",
          fontWeight: 700,
          color: "#1A2035",
          marginBottom: "14px",
          paddingBottom: "10px",
          borderBottom: "2px solid #E4E8F0",
        }}
      >
        <AppIcon name="edit" size={18} sx={{ mr: 0.5 }} /> Edit User
      </Typography>

      <Paper
        elevation={0}
        sx={{
          background: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          padding: "28px 32px",
        }}
      >
        <form onSubmit={onSubmit} noValidate>
          <Stack spacing={1.5}>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormTextField
                  {...field}
                  label="Full Name"
                  placeholder="e.g. John Smith"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || " "}
                  sx={{
                    "& .MuiInputLabel-root": {
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.7px",
                      color: "#7B89A8",
                    },
                  }}
                />
              )}
            />

            <Controller
              control={form.control}
              name="email"
              render={({ field, fieldState }) => (
                <FormTextField
                  {...field}
                  label="Email Address"
                  placeholder="john@buildpro.com"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || " "}
                  sx={{
                    "& .MuiInputLabel-root": {
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.7px",
                      color: "#7B89A8",
                    },
                  }}
                />
              )}
            />

            <Controller
              control={form.control}
              name="role"
              render={({ field, fieldState }) => (
                <FormSelectField
                  {...field}
                  label="Role"
                  options={[
                    { value: "User", label: "Field User" },
                    { value: "Trade", label: "Trade User" },
                    { value: "Management", label: "Management" },
                  ]}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message || " "}
                  sx={{
                    "& .MuiInputLabel-root": {
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.7px",
                      color: "#7B89A8",
                    },
                  }}
                />
              )}
            />

            <Controller
              control={form.control}
              name="password"
              render={({ field, fieldState }) => (
                <Box>
                  <FormTextField
                    {...field}
                    type="password"
                    label="New Password"
                    placeholder="Set new password"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message || " "}
                    sx={{
                      "& .MuiInputLabel-root": {
                        fontSize: 12,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.7px",
                        color: "#7B89A8",
                      },
                    }}
                  />
                  <Typography sx={{ fontSize: "11px", color: "#7B89A8", marginTop: "-4px" }}>
                    Leave blank to keep existing password.
                  </Typography>
                </Box>
              )}
            />
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
              Save Changes
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
              <AppIcon name="logout" size={13} /> Cancel
            </AppButton>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}

