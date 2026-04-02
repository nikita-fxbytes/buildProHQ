"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Controller, type UseFormReturn } from "react-hook-form";
import { FormAutocompleteField } from "@/components/common/FormAutocompleteField";
import { AppButton } from "@/components/common/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import { FormTextareaField } from "@/components/common/FormTextareaField";
import type { ManagerAddTaskFormValues } from "@/schemas/manager-add-task.schema";

type Props = {
  form: UseFormReturn<ManagerAddTaskFormValues>;
  levels: string[];
  trades: string[];
  onSubmit: () => void;
  onCancel: () => void;
  onPaste: () => void;
  toggleVoice: () => void;
  voiceActive: boolean;
};

export function FieldAddTaskView({
  form,
  levels,
  trades,
  onSubmit,
  onCancel,
  onPaste,
  toggleVoice,
  voiceActive,
}: Props) {
  return (
    <Box sx={{ maxWidth: "640px" }}>
      <Paper
        elevation={0}
        sx={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          padding: "28px 32px",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: "16px",
            fontWeight: 700,
            color: "#1A2035",
            marginBottom: "14px",
            paddingBottom: "10px",
            borderBottom: "2px solid #E4E8F0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <AppIcon name="clipboard" size={16} /> New Action Item
        </Typography>

        <form onSubmit={onSubmit} noValidate>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
            <Box sx={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "6px" }}>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#7B89A8",
                  textTransform: "uppercase",
                  letterSpacing: "0.7px",
                }}
              >
                Description
              </Typography>

              <Box sx={{ position: "relative" }}>
                <Controller
                  control={form.control}
                  name="desc"
                  render={({ field, fieldState }) => (
                    <FormTextareaField
                      {...field}
                      minRows={4}
                      placeholder="Describe the action item..."
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message || " "}
                      sx={{
                        "& .MuiInputBase-root": {
                          pr: "80px",
                        },
                        "& .MuiOutlinedInput-input": {
                          fontSize: "14px",
                          padding: "10px 14px",
                        },
                      }}
                    />
                  )}
                />

                <Stack direction="row" spacing={0.75} sx={{ position: "absolute", top: 8, right: 8 }}>
                  <Box
                    component="button"
                    type="button"
                    title="Voice Input"
                    onClick={toggleVoice}
                    sx={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      border: "1.5px solid",
                      borderColor: voiceActive ? "#EF4444" : "#E4E8F0",
                      background: voiceActive ? "#FEE2E2" : "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s",
                      "&:hover": {
                        borderColor: "#F5A623",
                      },
                    }}
                  >
                    <AppIcon name="mic" size={16} />
                  </Box>
                  <Box
                    component="button"
                    type="button"
                    title="Paste from Clipboard"
                    onClick={onPaste}
                    sx={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      border: "1.5px solid #E4E8F0",
                      background: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.15s",
                      "&:hover": {
                        borderColor: "#F5A623",
                      },
                    }}
                  >
                    <AppIcon name="clipboard" size={15} />
                  </Box>
                </Stack>
              </Box>

              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#7B89A8",
                  marginTop: "4px",
                  display: voiceActive ? "block" : "none",
                }}
              >
                <AppIcon name="listening" size={12} sx={{ mr: 0.25 }} /> Listening... speak your action item
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#7B89A8", textTransform: "uppercase", letterSpacing: "0.7px" }}>
                Level
              </Typography>
              <FormAutocompleteField<ManagerAddTaskFormValues, string>
                control={form.control}
                name="level"
                options={levels}
                placeholder="Select Level"
                isOptionEqualToValue={(option, value) => option === value}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <Typography sx={{ fontSize: "12px", fontWeight: 700, color: "#7B89A8", textTransform: "uppercase", letterSpacing: "0.7px" }}>
                Trade
              </Typography>
              <FormAutocompleteField<ManagerAddTaskFormValues, string>
                control={form.control}
                name="trade"
                options={trades}
                placeholder="Select Trade"
                isOptionEqualToValue={(option, value) => option === value}
              />
            </Box>
          </Box>

          <Stack direction="row" spacing={1.25} sx={{ mt: "22px" }}>
            <AppButton
              type="submit"
              variant="contained"
              sx={{ background: "#F5A623", color: "#fff", "&:hover": { background: "#E09010" } }}
            >
              + Add Action Item
            </AppButton>
            <AppButton
              type="button"
              variant="outlined"
              onClick={onCancel}
              sx={{ borderColor: "#E4E8F0", color: "#1A2035", "&:hover": { borderColor: "#F5A623", color: "#F5A623" } }}
            >
              Cancel
            </AppButton>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
