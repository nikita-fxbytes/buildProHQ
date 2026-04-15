import Autocomplete from "@mui/material/Autocomplete";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import type { SxProps, Theme } from "@mui/material/styles";
import { FormTextField } from "@/components/common/FormTextField";
import { MESSAGES } from "@/constants/messages";

export type UserOption = { value: string; label: string };

export type UserMultiSelectFieldProps = {
  options: UserOption[];
  valueIds: string[];
  onChangeIds: (next: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
  maxChips?: number;
  sx?: SxProps<Theme>;
};

const toInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((s) => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export function UserMultiSelectField(props: UserMultiSelectFieldProps) {
  const maxChips = props.maxChips ?? 2;
  const selected = props.options.filter((o) => props.valueIds.includes(o.value));

  return (
    <Autocomplete<UserOption, true, false, false>
      multiple
      options={props.options}
      value={selected}
      onChange={(_, next) => props.onChangeIds(next.map((x) => x.value))}
      disableCloseOnSelect
      limitTags={maxChips}
      getOptionLabel={(o) => o.label}
      isOptionEqualToValue={(a, b) => a.value === b.value}
      disabled={props.disabled}
      noOptionsText={MESSAGES.taskForm.autocompleteNoOptions}
      renderTags={(tagValue, getTagProps) => {
        const shown = tagValue.slice(0, maxChips);
        const more = tagValue.length - shown.length;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              flexWrap: "wrap",
              overflow: "hidden",
              maxWidth: "100%",
              maxHeight: 56, // allow up to ~2 chip rows, never grow further
            }}
          >
            {shown.map((option, index) => {
              const { key, ...rest } = getTagProps({ index });
              const nameOnly = option.label.split("(")[0]?.trim() || option.label;
              return (
                <Chip
                  key={key}
                  {...rest}
                  size="small"
                  label={option.label}
                  avatar={
                    <Avatar sx={{ width: 18, height: 18, fontSize: 10, fontWeight: 800 }}>
                      {toInitials(nameOnly)}
                    </Avatar>
                  }
                  sx={{
                    maxWidth: 140,
                    height: 26,
                    "& .MuiChip-label": {
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    },
                  }}
                />
              );
            })}
            {more > 0 ? (
              <Chip
                size="small"
                label={`+${more}`}
                sx={{ height: 26, fontWeight: 800, background: "#F3F4F6", border: "1px solid #E5E7EB" }}
              />
            ) : null}
          </Box>
        );
      }}
      renderOption={(liProps, option, { selected }) => {
        const { key, ...rest } = liProps;
        return (
          <li key={key} {...rest}>
            <Checkbox size="small" checked={selected} sx={{ mr: 1, p: 0 }} />
            {option.label}
          </li>
        );
      }}
      renderInput={(params) => (
        <FormTextField
          {...params}
          placeholder={props.placeholder ?? "Select Users"}
          disabled={props.disabled}
          sx={{
            ...(props.sx || {}),
            "& .MuiInputBase-root": {
              flexWrap: "wrap",
              overflow: "hidden",
              minHeight: 40,
            },
            "& .MuiAutocomplete-tag": { maxWidth: 140 },
          }}
        />
      )}
    />
  );
}

