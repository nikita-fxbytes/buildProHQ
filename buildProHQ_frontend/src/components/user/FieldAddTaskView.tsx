"use client";

import { useMemo } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Controller, type UseFormReturn } from "react-hook-form";
import { FormLookupAutocompleteField } from "@/components/common/FormLookupAutocompleteField";
import { AppButton } from "@/components/common/AppButton";
import { AppIcon } from "@/components/common/AppIcon";
import { FormRichTextField } from "@/components/common/FormRichTextField";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import type { FieldAddTaskFormValues } from "@/schemas/field-add-task.schema";
import type { LookupItem } from "@/services/lookupsApi.service";
import { MESSAGES } from "@/constants/messages";
import {
  TASK_BEFORE_PHOTOS_MAX,
  TASK_PRIORITY_LABEL,
  TASK_PRIORITY_SX,
  type TaskPriorityCode,
} from "@/constants/task-form.constants";
import type { UploadItem } from "@/components/common/FormUploadField";
import { FormUploadField } from "@/components/common/FormUploadField";
import { FieldAddTaskFormSkeleton } from "@/components/common/skeletons/FieldAddTaskFormSkeleton";

type Props = {
  form: UseFormReturn<FieldAddTaskFormValues>;
  projects: LookupItem[];
  levels: LookupItem[];
  trades: LookupItem[];
  priorityOptions: LookupItem[];
  photos: UploadItem[];
  setPhotos: (items: UploadItem[]) => void;
  loadingLookups: boolean;
  submitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  onPaste: () => void;
  toggleVoice: () => void;
  voiceActive: boolean;
};

function sortLookups(items: LookupItem[]): LookupItem[] {
  return [...items].sort((a, b) => {
    const ao = a.sortOrder ?? 0;
    const bo = b.sortOrder ?? 0;
    if (ao !== bo) return ao - bo;
    return a.name.localeCompare(b.name);
  });
}

function priorityCodeFromLookup(p: LookupItem): TaskPriorityCode | null {
  const c = p.code.toLowerCase();
  if (c === "low" || c === "medium" || c === "high" || c === "critical") {
    return c;
  }
  return null;
}

export function FieldAddTaskView({
  form,
  projects,
  levels,
  trades,
  priorityOptions,
  photos,
  setPhotos,
  loadingLookups,
  submitting,
  onSubmit,
  onCancel,
  onPaste,
  toggleVoice,
  voiceActive,
}: Props) {
  const sortedProjects = useMemo(() => sortLookups(projects), [projects]);
  const sortedLevels = useMemo(() => sortLookups(levels), [levels]);
  const sortedTrades = useMemo(() => sortLookups(trades), [trades]);

  if (loadingLookups) {
    return <FieldAddTaskFormSkeleton />;
  }

  const disabled = submitting;

  return (
    <Box sx={{ maxWidth: "640px" }}>
      <Paper
        elevation={0}
        sx={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          padding: "28px 32px",
          position: "relative",
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
          <span aria-hidden>📋</span> New Action Item
        </Typography>

        <form onSubmit={onSubmit} noValidate>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
            <Box sx={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "6px" }}>
              <FormFieldLabel required>Project</FormFieldLabel>
              <FormLookupAutocompleteField
                control={form.control}
                name="projectId"
                options={sortedProjects}
                placeholder="Select Project"
                noOptionsText={MESSAGES.taskForm.autocompleteNoOptions}
                disabled={disabled}
              />
            </Box>

            <Box sx={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "6px" }}>
              <FormFieldLabel required>Description</FormFieldLabel>

              <Box sx={{ position: "relative" }}>
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <FormRichTextField
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      disabled={disabled}
                      placeholder="Describe the action item..."
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
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
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      border: "1.5px solid",
                      borderColor: voiceActive ? "#EF4444" : "#E4E8F0",
                      background: voiceActive ? "#FEE2E2" : "#fff",
                      cursor: disabled ? "not-allowed" : "pointer",
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
                    disabled={disabled}
                    onClick={onPaste}
                    sx={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      border: "1.5px solid #E4E8F0",
                      background: "#fff",
                      cursor: disabled ? "not-allowed" : "pointer",
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
                  display: voiceActive ? "flex" : "none",
                  alignItems: "center",
                  gap: 0.25,
                }}
              >
                <span aria-hidden>🔴</span> {MESSAGES.taskForm.voiceListeningLine}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <FormFieldLabel required>Level</FormFieldLabel>
              <FormLookupAutocompleteField
                control={form.control}
                name="levelId"
                options={sortedLevels}
                placeholder={MESSAGES.taskForm.selectLevelPlaceholder}
                noOptionsText={MESSAGES.taskForm.autocompleteNoOptions}
                disabled={disabled}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <FormFieldLabel required>Trade</FormFieldLabel>
              <FormLookupAutocompleteField
                control={form.control}
                name="tradeId"
                options={sortedTrades}
                placeholder={MESSAGES.taskForm.selectTradePlaceholder}
                noOptionsText={MESSAGES.taskForm.autocompleteNoOptions}
                disabled={disabled}
              />
            </Box>

            <Box sx={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "6px" }}>
              <FormFieldLabel required>Priority</FormFieldLabel>
              <Controller
                control={form.control}
                name="priorityId"
                render={({ field, fieldState }) => (
                  <Box>
                    <Stack
                      direction="row"
                      useFlexGap
                      flexWrap="wrap"
                      sx={{ gap: "8px" }}
                    >
                      {priorityOptions.map((p) => {
                        const code = priorityCodeFromLookup(p);
                        const ui = code ? TASK_PRIORITY_SX[code] : null;
                        const label = code ? TASK_PRIORITY_LABEL[code] : p.name;
                        const selected = field.value === p.id;
                        return (
                          <AppButton
                            key={p.id}
                            type="button"
                            disabled={disabled}
                            onClick={() => field.onChange(p.id)}
                            sx={{
                              padding: "7px 16px",
                              borderRadius: "8px",
                              border: ui?.border ?? "2px solid #E4E8F0",
                              background: selected
                                ? ui?.background ?? "#FFF7ED"
                                : ui?.background ?? "#fafafa",
                              color: ui?.color ?? "#1A2035",
                              fontWeight: 700,
                              fontSize: "13px",
                              textTransform: "none",
                              boxShadow: "none",
                              opacity: selected ? 1 : 0.85,
                              outline: selected ? "2px solid #F5A623" : "none",
                              outlineOffset: 2,
                              "&:hover": {
                                opacity: 1,
                                borderColor: "#F5A623",
                              },
                            }}
                          >
                            {label}
                          </AppButton>
                        );
                      })}
                    </Stack>
                    {fieldState.error ? (
                      <Typography sx={{ fontSize: "12px", color: "error.main", mt: 0.5 }}>
                        {fieldState.error.message}
                      </Typography>
                    ) : null}
                  </Box>
                )}
              />
            </Box>

            <Box sx={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "6px" }}>
              <FormFieldLabel>{MESSAGES.taskForm.beforePhotosSection}</FormFieldLabel>
              <FormUploadField
                mode="multiple"
                value={photos}
                onChange={setPhotos}
                maxFiles={TASK_BEFORE_PHOTOS_MAX}
                maxSizeBytes={10 * 1024 * 1024}
                disabled={disabled}
              />
            </Box>
          </Box>

          <Stack direction="row" spacing={1.25} sx={{ mt: "22px" }}>
            <AppButton
              type="submit"
              variant="contained"
              disabled={disabled}
              sx={{ background: "#F5A623", color: "#fff", "&:hover": { background: "#E09010" } }}
            >
              + Add Action Item
            </AppButton>
            <AppButton
              type="button"
              variant="outlined"
              disabled={disabled}
              onClick={onCancel}
              sx={{
                borderColor: "#E4E8F0",
                color: "#1A2035",
                "&:hover": { borderColor: "#F5A623", color: "#F5A623" },
              }}
            >
              Cancel
            </AppButton>
          </Stack>
        </form>
      </Paper>

    </Box>
  );
}
