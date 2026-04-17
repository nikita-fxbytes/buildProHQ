"use client";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import type { ProjectFilterDefinition } from "@/services/projectsApi.service";
import type { TaskFilterValueForm } from "@/utils/taskFilterValues";
import { getTaskFilterValueForFilter, upsertTaskFilterValue } from "@/utils/taskFilterValues";

export type TaskDynamicFiltersFieldsProps = {
  definitions: ProjectFilterDefinition[];
  value: TaskFilterValueForm[];
  onChange: (next: TaskFilterValueForm[]) => void;
  disabled?: boolean;
  loading?: boolean;
};

export function TaskDynamicFiltersFields(props: TaskDynamicFiltersFieldsProps) {
  const { definitions, value, onChange, disabled, loading } = props;

  if (loading) {
    return (
      <Typography sx={{ fontSize: 13, color: "#7B89A8" }}>Loading project filters…</Typography>
    );
  }

  if (!definitions.length) {
    return (
      <Typography sx={{ fontSize: 13, color: "#7B89A8" }}>
        No filters available.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {definitions.map((def) => (
        <OneFilterField
          key={def.id}
          def={def}
          current={getTaskFilterValueForFilter(value, def.id)}
          disabled={disabled}
          onChange={(patch) => onChange(upsertTaskFilterValue(value, def.id, patch))}
        />
      ))}
    </Box>
  );
}

type Opt = { id: string; label: string };

function OneFilterField(props: {
  def: ProjectFilterDefinition;
  current?: TaskFilterValueForm;
  disabled?: boolean;
  onChange: (patch: { subFilterIds?: string[]; textValue?: string | null }) => void;
}) {
  const { def, current, disabled, onChange } = props;
  const opts: Opt[] = (def.subFilters ?? []).map((s) => ({ id: s.id, label: s.name }));

  if (!def.hasSubFilters) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{def.name}</Typography>
        <TextField
          size="small"
          value={current?.textValue ?? ""}
          onChange={(e) => onChange({ textValue: e.target.value })}
          placeholder={`Enter ${def.name.toLowerCase()}`}
          disabled={disabled}
        />
      </Box>
    );
  }

  const selectedIds = current?.subFilterIds ?? [];
  const selectedOpts = opts.filter((o) => selectedIds.includes(o.id));

  if (def.isMultiSelect) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{def.name}</Typography>
        <Autocomplete<Opt, true>
          multiple
          options={opts}
          value={selectedOpts}
          onChange={(_, items) => onChange({ subFilterIds: items.map((i) => i.id) })}
          getOptionLabel={(o) => o.label}
          isOptionEqualToValue={(a, b) => a.id === b.id}
          disabled={disabled}
          renderInput={(params) => <TextField {...params} size="small" placeholder="Search…" />}
        />
      </Box>
    );
  }

  const single = selectedOpts[0] ?? null;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{def.name}</Typography>
      <Autocomplete<Opt, false>
        options={opts}
        value={single}
        onChange={(_, item) => onChange({ subFilterIds: item ? [item.id] : [] })}
        getOptionLabel={(o) => o.label}
        isOptionEqualToValue={(a, b) => a.id === b.id}
        disabled={disabled}
        renderInput={(params) => <TextField {...params} size="small" placeholder="Select one…" />}
      />
    </Box>
  );
}
