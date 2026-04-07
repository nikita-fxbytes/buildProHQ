import Autocomplete, { type AutocompleteProps } from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import type { TextFieldProps } from "@mui/material/TextField";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";
import {
  autocompleteControlSx,
  autocompleteListboxSx,
  mergeSx,
  autocompletePaperSx,
} from "@/components/common/fieldStyles";
import { compactHelperText } from "@/components/common/formField.utils";

type AppAutocompleteBaseProps<T, Multiple extends boolean | undefined> = Omit<
  AutocompleteProps<T, Multiple, false, false>,
  "renderInput" | "options" | "value" | "onChange"
> & {
  label?: string;
  name?: string;
  options: readonly T[];
  value: Multiple extends true ? T[] : T | null;
  onChange: (value: Multiple extends true ? T[] : T | null) => void;
  placeholder?: string;
  error?: boolean;
  helperText?: ReactNode;
  required?: boolean;
  sx?: SxProps<Theme>;
  textFieldProps?: Partial<TextFieldProps>;
};

export type AppAutocompleteProps<T, Multiple extends boolean | undefined = false> =
  AppAutocompleteBaseProps<T, Multiple>;

const defaultGetOptionLabel = <T,>(option: T): string => {
  if (typeof option === "string") return option;
  if (option && typeof option === "object") {
    if ("label" in option && typeof option.label === "string") return option.label;
    if ("value" in option && typeof option.value === "string") return option.value;
  }
  return String(option);
};

export function AppAutocomplete<T, Multiple extends boolean | undefined = false>({
  label,
  name,
  options,
  value,
  onChange,
  placeholder,
  error,
  helperText,
  required,
  sx,
  textFieldProps,
  getOptionLabel,
  noOptionsText = "No options",
  ...rest
}: AppAutocompleteProps<T, Multiple>) {
  return (
    <Autocomplete<T, Multiple, false, false>
      options={options}
      value={value}
      onChange={(_, nextValue) => onChange(nextValue as Multiple extends true ? T[] : T | null)}
      getOptionLabel={getOptionLabel ?? defaultGetOptionLabel}
      noOptionsText={noOptionsText}
      slotProps={{
        paper: { sx: autocompletePaperSx },
        listbox: { sx: autocompleteListboxSx },
      }}
      {...rest}
      renderInput={(params) => (
        <TextField
          {...params}
          name={name}
          label={label}
          placeholder={placeholder}
          size="small"
          required={required}
          error={error}
          helperText={compactHelperText(helperText)}
          {...textFieldProps}
        />
      )}
      sx={mergeSx(autocompleteControlSx, sx)}
    />
  );
}
