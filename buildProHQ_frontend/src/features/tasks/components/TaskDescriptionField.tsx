"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Controller, type Path, type UseFormReturn } from "react-hook-form";
import { AppIcon } from "@/components/common/AppIcon";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { FormRichTextField } from "@/components/common/FormRichTextField";
import { MESSAGES } from "@/constants/messages";
import { useTaskDescriptionTools } from "@/hooks/useTaskDescriptionTools";

type DescForm = { description: string };

type Props<T extends DescForm> = {
  form: UseFormReturn<T>;
  disabled: boolean;
  required?: boolean;
};

/**
 * Shared rich description for create + edit: typing, paste, and voice input (same UX as add-task HTML).
 */
export function TaskDescriptionField<T extends DescForm>({ form, disabled, required = true }: Props<T>) {
  const { voiceActive, toggleVoice, onPaste } = useTaskDescriptionTools(
    form as unknown as UseFormReturn<{ description: string }>,
  );

  return (
    <Box sx={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "6px" }}>
      <FormFieldLabel required={required}>Description</FormFieldLabel>

      <Box sx={{ position: "relative" }}>
        <Controller
          control={form.control}
          name={"description" as Path<T>}
          render={({ field, fieldState }) => (
            <FormRichTextField
              name={field.name as string}
              value={field.value as string}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={disabled}
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
            disabled={disabled}
            onClick={toggleVoice}
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              border: "1.5px solid",
              borderColor: voiceActive ? "#EF4444" : "#E4E8F0",
              background: voiceActive ? "#FEE2E2" : "#fff",
              cursor: disabled ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              transition: "all 0.15s",
              "&:hover": { borderColor: "#F5A623" },
            }}
          >
            <AppIcon name="mic" size={16} />
          </Box>
          <Box
            component="button"
            type="button"
            title="Paste from Clipboard"
            disabled={disabled}
            onClick={onPaste}
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              border: "1.5px solid #E4E8F0",
              background: "#fff",
              cursor: disabled ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              transition: "all 0.15s",
              "&:hover": { borderColor: "#F5A623" },
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
          display: voiceActive ? "flex" : "none",
          alignItems: "center",
          gap: 0.25,
        }}
      >
        <span aria-hidden>🔴</span> {MESSAGES.taskForm.voiceListeningLine}
      </Typography>
    </Box>
  );
}
