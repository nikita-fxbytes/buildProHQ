"use client";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppButton } from "@/components/common/AppButton";
import { AppAutocomplete } from "@/components/common/AppAutocomplete";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import { FormTextField } from "@/components/common/FormTextField";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import type { ProjectListItem } from "@/services/projectsApi.service";

export type SuperFilterFormViewProps = {
  mode: "create" | "edit";
  loading: boolean;
  saving: boolean;
  projects: ProjectListItem[];
  projectIds: string[];
  setProjectIds: (ids: string[]) => void;
  name: string;
  setName: (v: string) => void;
  hasSubFilters: boolean;
  setHasSubFilters: (v: boolean) => void;
  isMultiSelect: boolean;
  setIsMultiSelect: (v: boolean) => void;
  subsCsv: string;
  setSubsCsv: (v: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

type ProjectOpt = { id: string; name: string };

export function SuperFilterFormView(props: SuperFilterFormViewProps) {
  const projectOptions: ProjectOpt[] = props.projects.map((p) => ({ id: p.id, name: p.name }));
  const selected = projectOptions.filter((p) => props.projectIds.includes(p.id));

  return (
    <Box sx={{ maxWidth: 760 }}>
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
            fontFamily: STYLE_TOKENS.typography.fontDisplay,
            fontSize: 16,
            fontWeight: 800,
            color: STYLE_TOKENS.colors.text,
            marginBottom: "14px",
            paddingBottom: "10px",
            borderBottom: `2px solid ${STYLE_TOKENS.colors.border}`,
          }}
        >
          {props.mode === "create" ? "Add Filter" : "Edit Filter"}
        </Typography>

        <Stack spacing={1.75}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <FormFieldLabel required>Projects</FormFieldLabel>
            <AppAutocomplete<ProjectOpt, true>
              multiple
              options={projectOptions}
              value={selected}
              onChange={(items) => props.setProjectIds(items.map((x) => x.id))}
              getOptionLabel={(o) => o.name}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              textFieldProps={{ placeholder: "Select projects..." }}
              disabled={props.loading || props.saving}
            />
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <FormFieldLabel required>Filter name</FormFieldLabel>
            <FormTextField
              value={props.name}
              onChange={(e) => props.setName(e.target.value)}
              placeholder="e.g. Level, Zone, Trade…"
              disabled={props.loading || props.saving}
            />
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={props.hasSubFilters}
                onChange={(_, v) => {
                  props.setHasSubFilters(v);
                  if (!v) props.setIsMultiSelect(false);
                }}
                disabled={props.loading || props.saving}
              />
            }
            label="Has sub-filters (autocomplete options)"
          />

          {props.hasSubFilters ? (
            <>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={props.isMultiSelect}
                    onChange={(_, v) => props.setIsMultiSelect(v)}
                    disabled={props.loading || props.saving}
                  />
                }
                label="Allow multi-select"
              />
              <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <FormFieldLabel required>Sub-filter names (comma-separated)</FormFieldLabel>
                <FormTextField
                  value={props.subsCsv}
                  onChange={(e) => props.setSubsCsv(e.target.value)}
                  placeholder="e.g. Senior, Junior, Electrician"
                  disabled={props.loading || props.saving}
                  helperText="Duplicates are ignored."
                />
              </Box>
            </>
          ) : null}

          <Box sx={{ display: "flex", gap: 1 }}>
            <AppButton variant="contained" onClick={props.onSubmit} disabled={props.loading || props.saving}>
              {props.saving ? "Saving..." : "Save"}
            </AppButton>
            <AppButton variant="outlined" onClick={props.onCancel} disabled={props.saving}>
              Cancel
            </AppButton>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
