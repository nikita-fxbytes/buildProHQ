"use client";

import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Controller, type UseFormReturn } from "react-hook-form";
import { AppAutocomplete } from "@/components/common/AppAutocomplete";
import { FileUpload, type UploadItem } from "@/components/common/FileUpload";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { FormLookupAutocompleteField } from "@/components/common/FormLookupAutocompleteField";
import { FormTextField } from "@/components/common/FormTextField";
import { TaskDescriptionField } from "@/features/tasks/components/TaskDescriptionField";
import { TaskPrioritySelectField } from "@/features/tasks/components/TaskPrioritySelectField";
import { UserMultiSelectField } from "@/features/tasks/components/UserMultiSelectField";
import type { TaskFormValues } from "@/schemas/task-form.schema";
import type { LookupItem } from "@/services/lookupsApi.service";
import type { TaskAttachmentItem } from "@/services/tasksApi.service";
import { MESSAGES } from "@/constants/messages";
import { TASK_BEFORE_PHOTOS_MAX } from "@/constants/task-form.constants";
import type { ProjectOptionRow } from "@/features/tasks/utils/projectAutocompleteOptions";

export type TaskFormViewProps = {
  form: UseFormReturn<TaskFormValues>;
  disabled: boolean;
  /** Manager create uses lookup list; super edit uses searchable project autocomplete. */
  projectMode: "lookup" | "search";
  projectLookupOptions?: LookupItem[];
  projectSearch?: {
    options: ProjectOptionRow[];
    input: string;
    setInput: (v: string) => void;
    setSelectedLabel: (v: string) => void;
  };
  levels: LookupItem[];
  trades: LookupItem[];
  priorities: LookupItem[];
  userOptions: Array<{ value: string; label: string }>;
  /** File section: create = single upload state; edit = existing server files + new uploads. */
  files:
    | {
        mode: "create";
        items: UploadItem[];
        onChange: (next: UploadItem[]) => void;
      }
    | {
        mode: "edit";
        existing: TaskAttachmentItem[];
        newItems: UploadItem[];
        onNewChange: (next: UploadItem[]) => void;
      };
  /** Optional slot (e.g. comments + history on edit page). */
  children?: ReactNode;
};

function sortLookups(items: LookupItem[]): LookupItem[] {
  return [...items].sort((a, b) => {
    const ao = a.sortOrder ?? 0;
    const bo = b.sortOrder ?? 0;
    if (ao !== bo) return ao - bo;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Pure presentational task form: title, rich description, project, level, trade, priority, due date,
 * assignee, and attachments. No API calls — parent controller supplies all handlers and options.
 */
export function TaskFormView(props: TaskFormViewProps) {
  const { form, disabled } = props;
  const sortedLevels = sortLookups(props.levels);
  const sortedTrades = sortLookups(props.trades);
  const sortedProjects = props.projectLookupOptions ? sortLookups(props.projectLookupOptions) : [];

  const maxNewFiles =
    props.files.mode === "create"
      ? TASK_BEFORE_PHOTOS_MAX
      : Math.max(0, TASK_BEFORE_PHOTOS_MAX - props.files.existing.length);

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
      <Box sx={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "6px" }}>
        <FormFieldLabel required>Title</FormFieldLabel>
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <FormTextField
              {...field}
              disabled={disabled}
              placeholder="Short summary for lists and reports"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Box>

      {props.projectMode === "lookup" ? (
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
      ) : (
        <Box sx={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "6px" }}>
          <FormFieldLabel required>Project</FormFieldLabel>
          {props.projectSearch ? (
            <Controller
              control={form.control}
              name="projectId"
              render={({ field, fieldState }) => (
                <AppAutocomplete<ProjectOptionRow>
                  options={props.projectSearch!.options}
                  filterOptions={(opts) => opts}
                  value={props.projectSearch!.options.find((o) => o.value === field.value) ?? null}
                  onChange={(opt) => {
                    field.onChange(opt?.value ?? "");
                    if (opt) {
                      props.projectSearch!.setSelectedLabel(opt.label);
                      props.projectSearch!.setInput(opt.label);
                    }
                  }}
                  inputValue={props.projectSearch!.input}
                  onInputChange={(_, v) => props.projectSearch!.setInput(v)}
                  getOptionLabel={(o) => o.label}
                  isOptionEqualToValue={(a, b) => a.value === b.value}
                  disabled={disabled}
                  noOptionsText={MESSAGES.taskForm.autocompleteNoOptions}
                  textFieldProps={{
                    placeholder: MESSAGES.task.projectSearchPlaceholder,
                  }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          ) : null}
        </Box>
      )}

      <TaskDescriptionField form={form} disabled={disabled} required />

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

      {/* Assign Users (single compact field) */}
      <Box
        sx={{
          gridColumn: "span 2",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          width: "100%",
          minWidth: 0,
        }}
      >
        <FormFieldLabel>Assign Users</FormFieldLabel>
        <Controller
          control={form.control}
          name="assignedToUserIds"
          render={({ field }) => (
            <UserMultiSelectField
              options={props.userOptions}
              valueIds={Array.isArray(field.value) ? field.value : []}
              onChangeIds={(next) => field.onChange(next)}
              disabled={disabled}
              placeholder="Select Assignees"
              maxChips={3}
            />
          )}
        />
      </Box>

      {/* Compact row: Priority + Due Date */}
      <Box
        sx={{
          gridColumn: "span 2",
          display: "grid",
          gap: "12px",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          alignItems: "start",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <TaskPrioritySelectField
            control={form.control}
            name="priorityId"
            priorities={props.priorities}
            disabled={disabled}
            required
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <FormFieldLabel>Due Date</FormFieldLabel>
          <Controller
            control={form.control}
            name="dueDate"
            render={({ field, fieldState }) => (
              <FormTextField
                {...field}
                type="date"
                disabled={disabled}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
        </Box>
      </Box>

      <Box sx={{ gridColumn: "span 2" }}>
        {props.files.mode === "edit" && props.files.existing.length > 0 ? (
          <Box sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 800, mb: 1, color: "text.secondary" }}>
              Current attachments
            </Typography>
            {props.files.existing.map((a) => (
              <Typography key={a.id} sx={{ fontSize: 13, mb: 0.5 }}>
                <Box
                  component="a"
                  href={a.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ fontWeight: 700 }}
                >
                  {a.fileName}
                </Box>
              </Typography>
            ))}
          </Box>
        ) : null}
        <FileUpload
          mode="multiple"
          label={MESSAGES.taskForm.beforePhotosSection}
          value={props.files.mode === "create" ? props.files.items : props.files.newItems}
          onChange={props.files.mode === "create" ? props.files.onChange : props.files.onNewChange}
          maxFiles={maxNewFiles}
          maxSizeBytes={10 * 1024 * 1024}
          disabled={disabled}
        />
      </Box>

      {props.children ? <Box sx={{ gridColumn: "span 2" }}>{props.children}</Box> : null}
    </Box>
  );
}
