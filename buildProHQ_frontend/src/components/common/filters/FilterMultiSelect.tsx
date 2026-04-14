"use client";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { FILTER_TOKENS } from "@/styles/filter-tokens";
import { MESSAGES } from "@/constants/messages";

type Opt = { value: string; label: string };

export type FilterMultiSelectProps = {
  label: string;
  options: Array<string | Opt>;
  selected: string[];
  onChange: (nextSelected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function FilterMultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder,
  disabled,
}: FilterMultiSelectProps) {
  const normalizedRaw: Opt[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt,
  );
  // Defensive: ensure option "value" is unique; duplicates can cause React key warnings inside MUI.
  const normalized = Array.from(
    new Map(normalizedRaw.map((o) => [o.value, o] as const)).values(),
  );
  const selectedSet = new Set(selected);
  const value = normalized.filter((o) => selectedSet.has(o.value));

  return (
    <Box>
      <Typography
        sx={{
          fontSize: FILTER_TOKENS.groupLabel.fontSize,
          fontWeight: FILTER_TOKENS.groupLabel.fontWeight,
          color: FILTER_TOKENS.groupLabel.color,
          textTransform: FILTER_TOKENS.groupLabel.textTransform,
          letterSpacing: FILTER_TOKENS.groupLabel.letterSpacing,
          mb: 1,
        }}
      >
        {label}
      </Typography>
      <Autocomplete<Opt, true, false, false>
        multiple
        options={normalized}
        value={value}
        onChange={(_, next) =>
          onChange(Array.from(new Set(next.map((x) => x.value))))
        }
        disableCloseOnSelect
        limitTags={2}
        getOptionLabel={(o) => o.label}
        isOptionEqualToValue={(a, b) => a.value === b.value}
        disabled={disabled}
        noOptionsText={MESSAGES.taskForm.autocompleteNoOptions}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip
                {...tagProps}
                key={key ?? option.value}
                label={option.label}
                size="small"
              />
            );
          })
        }
        renderOption={(props, option, { selected: isSelected }) => {
          // React keys must be passed directly, not via `{...props}`.
          // Prefer MUI-provided key, otherwise fall back to stable unique option.value.
          const { key, ...liProps } = props as unknown as { key?: React.Key } & Record<string, unknown>;
          return (
            <li {...liProps} key={key ?? option.value}>
              <Checkbox size="small" checked={isSelected} sx={{ mr: 1, p: 0 }} />
              {option.label}
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            size="small"
            placeholder={placeholder ?? `Select ${label}...`}
            sx={{
              "& .MuiInputBase-root": {
                backgroundColor: "#FFFFFF",
                borderRadius: "8px",
                fontSize: 13,
              },
            }}
          />
        )}
      />
    </Box>
  );
}

