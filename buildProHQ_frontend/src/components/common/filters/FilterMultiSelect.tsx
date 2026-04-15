"use client";

import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
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
  chipVariant?: "default" | "priority" | "user" | "date";
};

const toInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function chipTone(variant: FilterMultiSelectProps["chipVariant"], label: string) {
  if (variant !== "priority") return { bg: "#F3F4F6", fg: "#374151", border: "#E5E7EB" };
  const key = label.trim().toLowerCase();
  if (key.includes("urgent") || key.includes("high")) return { bg: "#FEE2E2", fg: "#EF4444", border: "#FECACA" };
  if (key.includes("medium")) return { bg: "#FEF3C7", fg: "#B45309", border: "#FDE68A" };
  if (key.includes("low")) return { bg: "#DCFCE7", fg: "#16A34A", border: "#BBF7D0" };
  return { bg: "#F3F4F6", fg: "#374151", border: "#E5E7EB" };
}

export function FilterMultiSelect({
  label,
  options,
  selected,
  onChange,
  placeholder,
  disabled,
  chipVariant = "default",
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
        limitTags={3}
        getOptionLabel={(o) => o.label}
        isOptionEqualToValue={(a, b) => a.value === b.value}
        disabled={disabled}
        noOptionsText={MESSAGES.taskForm.autocompleteNoOptions}
        renderTags={(tagValue, getTagProps) => {
          const shown = tagValue.slice(0, 3);
          const more = tagValue.length - shown.length;
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                flexWrap: "nowrap",
                overflowX: "auto",
                maxWidth: "100%",
                whiteSpace: "nowrap",
                pr: 0.25,
                "&::-webkit-scrollbar": { height: 6 },
              }}
            >
              {shown.map((option, index) => {
                const { key, ...rest } = getTagProps({ index });
                const tone = chipTone(chipVariant, option.label);
                return (
                  <Chip
                    key={key}
                    {...rest}
                    size="small"
                    label={option.label}
                    avatar={
                      chipVariant === "user"
                        ? (
                            <Avatar sx={{ width: 18, height: 18, fontSize: 10, fontWeight: 800 }}>
                              {toInitials(option.label.split("(")[0] ?? option.label)}
                            </Avatar>
                          )
                        : undefined
                    }
                    sx={{
                      maxWidth: 120,
                      "& .MuiChip-label": {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                      background: tone.bg,
                      color: tone.fg,
                      border: `1px solid ${tone.border}`,
                      fontWeight: 700,
                    }}
                  />
                );
              })}
              {more > 0 ? (
                <Chip
                  size="small"
                  label={`+${more} more`}
                  sx={{
                    maxWidth: 90,
                    background: "#F3F4F6",
                    color: "#374151",
                    border: "1px solid #E5E7EB",
                    fontWeight: 700,
                  }}
                />
              ) : null}
            </Box>
          );
        }}
        renderOption={(props, option, { selected: isSelected }) => {
          const { key, ...rest } = props;
          return (
            <li key={key} {...rest}>
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
                flexWrap: "nowrap",
                overflowX: "auto",
              },
              "& .MuiAutocomplete-endAdornment": { right: 6 },
            }}
          />
        )}
      />
    </Box>
  );
}

