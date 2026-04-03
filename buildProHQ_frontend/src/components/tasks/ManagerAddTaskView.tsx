"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Controller, type UseFormReturn } from "react-hook-form";
import { AppButton } from "@/components/common/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import { FormSelectField } from "@/components/common/FormSelectField";
import { FormRichTextField } from "@/components/common/FormRichTextField";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
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

export function ManagerAddTaskView({
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
          <AppIcon name="folder" size={16} /> New Action Item
        </Typography>

        <form onSubmit={onSubmit} noValidate>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
            <Box sx={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "6px" }}>
              <FormFieldLabel required>Description</FormFieldLabel>

              <Box sx={{ position: "relative" }}>
                <Controller
                  control={form.control}
                  name="desc"
                  render={({ field, fieldState }) => (
                    <FormRichTextField
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Describe the action item..."
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      sx={{
                        "& > div:first-of-type": {
                          background: "#fff",
                          borderRadius: "8px",
                        },
                      }}
                    />
                  )}
                />

                <Stack direction="row" spacing={0.75} sx={{ position: "absolute", top: 46, right: 8 }}>
                  <Box
                    component="button"
                    type="button"
                    title="Voice Input"
                    onClick={toggleVoice}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      border: "1.5px solid",
                      borderColor: voiceActive ? "#EF4444" : "#E4E8F0",
                      background: voiceActive ? "#FEE2E2" : "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
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
                      width: 32,
                      height: 32,
                      borderRadius: "8px",
                      border: "1.5px solid #E4E8F0",
                      background: "#fff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                    }}
                  >
                    <AppIcon name="clipboard" size={15} />
                  </Box>
                </Stack>
              </Box>

              <Typography sx={{ fontSize: 11, color: "#7B89A8", mt: "-4px", display: voiceActive ? "block" : "none" }}>
                <AppIcon name="listening" size={12} /> Listening... speak your action item
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <FormFieldLabel required>Level</FormFieldLabel>
              <Controller
                control={form.control}
                name="level"
                render={({ field, fieldState }) => (
                  <FormSelectField
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    options={[
                      { value: "", label: "Select Level" },
                      ...levels.map((level) => ({ value: level, label: level })),
                    ]}
                    sx={{
                      "& .MuiInputBase-root": { fontSize: 14, background: "#fff" },
                      "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E4E8F0", borderWidth: 1.5 },
                    }}
                  />
                )}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <FormFieldLabel required>Trade</FormFieldLabel>
              <Controller
                control={form.control}
                name="trade"
                render={({ field, fieldState }) => (
                  <FormSelectField
                    {...field}
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    options={[
                      { value: "", label: "Select Trade" },
                      ...trades.map((trade) => ({ value: trade, label: trade })),
                    ]}
                    sx={{
                      "& .MuiInputBase-root": { fontSize: 14, background: "#fff" },
                      "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#E4E8F0", borderWidth: 1.5 },
                    }}
                  />
                )}
              />
            </Box>
          </Box>

          <Stack direction="row" spacing={1.25} sx={{ mt: "22px" }}>
            <AppButton
              type="submit"
              variant="contained"
              sx={{ background: "#F5A623", color: "#fff", "&:hover": { background: "#E09010" } }}
            >
              <AppIcon name="add" size={15} /> Add Action Item
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

