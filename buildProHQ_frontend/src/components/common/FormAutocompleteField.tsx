import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import { AppAutocomplete, type AppAutocompleteProps } from "@/components/common/AppAutocomplete";

export type FormAutocompleteFieldProps<
  TFieldValues extends FieldValues,
  TOption,
  Multiple extends boolean | undefined = false,
> = Omit<AppAutocompleteProps<TOption, Multiple>, "value" | "onChange" | "error" | "helperText"> & {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
};

export function FormAutocompleteField<
  TFieldValues extends FieldValues,
  TOption,
  Multiple extends boolean | undefined = false,
>({
  control,
  name,
  ...rest
}: FormAutocompleteFieldProps<TFieldValues, TOption, Multiple>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <AppAutocomplete<TOption, Multiple>
          {...rest}
          name={name}
          value={(field.value ?? null) as AppAutocompleteProps<TOption, Multiple>["value"]}
          onChange={(nextValue) => field.onChange(nextValue)}
          onBlur={field.onBlur}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
        />
      )}
    />
  );
}
