"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { SxProps, Theme } from "@mui/material/styles";
import { AppAutocomplete } from "@/components/common/AppAutocomplete";
import { mergeSx } from "@/components/common/fieldStyles";
import type { LookupItem } from "@/services/lookupsApi.service";

export type FormLookupAutocompleteFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  options: LookupItem[];
  placeholder: string;
  noOptionsText: string;
  disabled?: boolean;
  sx?: SxProps<Theme>;
  required?: boolean;
};

/**
 * Maps API lookup rows to MUI Autocomplete while the form field stores a UUID string.
 * Reuses {@link AppAutocomplete} / shared autocomplete styling (same stack as FormAutocompleteField).
 */
export function FormLookupAutocompleteField<T extends FieldValues>({
  control,
  name,
  options,
  placeholder,
  noOptionsText,
  disabled,
  sx,
}: FormLookupAutocompleteFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <AppAutocomplete<LookupItem>
          name={String(name)}
          options={options}
          value={options.find((o) => o.id === field.value) ?? null}
          onChange={(opt) => field.onChange(opt?.id ?? "")}
          onBlur={field.onBlur}
          getOptionLabel={(o) => o.name}
          isOptionEqualToValue={(a, b) => a.id === b.id}
          placeholder={placeholder}
          disabled={disabled}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          noOptionsText={noOptionsText}
          sx={mergeSx(sx)}
        />
      )}
    />
  );
}
