"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { Controller, type UseFormReturn } from "react-hook-form";
import { AppButton } from "@/components/common/AppButton";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { FormRichTextField } from "@/components/common/FormRichTextField";
import { FormLookupAutocompleteField } from "@/components/common/FormLookupAutocompleteField";
import { FormTextField } from "@/components/common/FormTextField";
import { AppAutocomplete } from "@/components/common/AppAutocomplete";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import type { LookupItem } from "@/services/lookupsApi.service";
import type { SuperTaskEditFormValues } from "@/features/tasks/hooks/useSuperTaskEditController";

type Props = {
  title: string;
  loading: boolean;
  submitting: boolean;
  form: UseFormReturn<SuperTaskEditFormValues>;
  levels: LookupItem[];
  trades: LookupItem[];
  priorities: LookupItem[];
  userOptions: Array<{ value: string; label: string }>;
  history: Array<{ id: string; changeReason?: string | null; changedAt?: string | null; notes?: string | null }>;
  comments: Array<{ id: string; comment: string; createdAt: string; createdBy: string }>;
  commentText: string;
  setCommentText: (v: string) => void;
  addComment: () => void;
  onSave: () => void;
  onCancel: () => void;
};

/**
 * Full-page task edit UI matching the HTML edit modal layout.
 */
export function SuperTaskEditView(props: Props) {
  const disabled = props.loading || props.submitting;

  return (
    <Box sx={{ maxWidth: "840px" }}>
      <Typography
        sx={{
          fontFamily: STYLE_TOKENS.typography.fontDisplay,
          fontSize: 22,
          fontWeight: 800,
          color: STYLE_TOKENS.colors.text,
          mb: 2,
        }}
      >
        Edit Task
      </Typography>

      <Paper
        elevation={0}
        sx={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: STYLE_TOKENS.shadow.card,
          padding: "22px 22px",
          position: "relative",
        }}
      >
        {props.loading ? (
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
            <CircularProgress size={28} sx={{ color: STYLE_TOKENS.colors.orange }} />
          </Box>
        ) : null}

        <Typography
          sx={{
            fontFamily: STYLE_TOKENS.typography.fontDisplay,
            fontSize: 16,
            fontWeight: 700,
            color: STYLE_TOKENS.colors.text,
            marginBottom: "14px",
            paddingBottom: "10px",
            borderBottom: `2px solid ${STYLE_TOKENS.colors.border}`,
          }}
        >
          ✏️ Edit Task
        </Typography>

        <form onSubmit={props.onSave} noValidate>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
            <Box sx={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "6px" }}>
              <FormFieldLabel required>Description</FormFieldLabel>
              <Controller
                control={props.form.control}
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
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <FormFieldLabel required>Level</FormFieldLabel>
              <FormLookupAutocompleteField
                control={props.form.control}
                name="levelId"
                options={props.levels}
                placeholder="Select Level"
                noOptionsText="No levels found"
                disabled={disabled}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <FormFieldLabel required>Trade</FormFieldLabel>
              <FormLookupAutocompleteField
                control={props.form.control}
                name="tradeId"
                options={props.trades}
                placeholder="Select Trade"
                noOptionsText="No trades found"
                disabled={disabled}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <FormFieldLabel required>Priority</FormFieldLabel>
              <FormLookupAutocompleteField
                control={props.form.control}
                name="priorityId"
                options={props.priorities}
                placeholder="Select Priority"
                noOptionsText="No priorities found"
                disabled={disabled}
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <FormFieldLabel>📅 Due Date / Deadline</FormFieldLabel>
              <Controller
                control={props.form.control}
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

            <Box sx={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "6px" }}>
              <FormFieldLabel>👤 Assign To User</FormFieldLabel>
              <Controller
                control={props.form.control}
                name="assignedToUserId"
                render={({ field }) => (
                  <AppAutocomplete<{ value: string; label: string }>
                    options={props.userOptions}
                    value={props.userOptions.find((o) => o.value === field.value) ?? null}
                    onChange={(opt) => field.onChange(opt?.value ?? null)}
                    getOptionLabel={(o) => o.label}
                    isOptionEqualToValue={(a, b) => a.value === b.value}
                    textFieldProps={{ placeholder: "Select user…" }}
                    disabled={disabled}
                  />
                )}
              />
            </Box>
          </Box>

          {/* Comments Section (HTML structure) */}
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>💬 Comments / Notes</Typography>
            <Stack spacing={1} sx={{ mb: 1.25 }}>
              {props.comments.length === 0 ? (
                <Typography sx={{ fontSize: 13, color: STYLE_TOKENS.colors.textMuted }}>
                  No comments yet.
                </Typography>
              ) : (
                props.comments.slice(0, 20).map((c) => (
                  <Box
                    key={c.id}
                    sx={{
                      border: `1px solid ${STYLE_TOKENS.colors.border}`,
                      borderRadius: "10px",
                      padding: "10px 12px",
                      background: "#FAFBFC",
                    }}
                  >
                    <Typography sx={{ fontSize: 12, color: STYLE_TOKENS.colors.textMuted }}>
                      {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                    </Typography>
                    <Typography sx={{ fontSize: 13.5, mt: 0.25 }}>{c.comment}</Typography>
                  </Box>
                ))
              )}
            </Stack>
            <Box sx={{ display: "flex", gap: 1 }}>
              <FormTextField
                value={props.commentText}
                onChange={(e) => props.setCommentText(e.target.value)}
                placeholder="Add a note or comment..."
                disabled={disabled}
              />
              <AppButton type="button" onClick={props.addComment} disabled={disabled || !props.commentText.trim()}>
                Add
              </AppButton>
            </Box>
          </Box>

          {/* Audit Log */}
          <Box sx={{ mt: 3 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>📜 Task History</Typography>
            <Stack spacing={1}>
              {props.history.length === 0 ? (
                <Typography sx={{ fontSize: 13, color: STYLE_TOKENS.colors.textMuted }}>
                  No history entries found.
                </Typography>
              ) : (
                props.history.slice(0, 12).map((h) => (
                  <Box
                    key={h.id}
                    sx={{
                      border: `1px solid ${STYLE_TOKENS.colors.border}`,
                      borderRadius: "10px",
                      padding: "10px 12px",
                      background: "#FAFBFC",
                    }}
                  >
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                      {h.changeReason || "Update"}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: STYLE_TOKENS.colors.textMuted }}>
                      {h.changedAt ? new Date(h.changedAt).toLocaleString() : ""}
                    </Typography>
                    {h.notes ? (
                      <Typography sx={{ fontSize: 12.5, mt: 0.5 }}>{h.notes}</Typography>
                    ) : null}
                  </Box>
                ))
              )}
            </Stack>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.25, mt: 3 }}>
            <AppButton variant="contained" type="submit" disabled={disabled}>
              💾 Save Changes
            </AppButton>
            <AppButton variant="outlined" type="button" onClick={props.onCancel} disabled={disabled}>
              Cancel
            </AppButton>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

