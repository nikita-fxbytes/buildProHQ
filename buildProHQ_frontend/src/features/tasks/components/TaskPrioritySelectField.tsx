"use client";

import Box from "@mui/material/Box";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { FormSelectField } from "@/components/common/FormSelectField";
import { FormFieldLabel } from "@/components/common/FormFieldLabel";
import type { LookupItem } from "@/services/lookupsApi.service";
import { buildTaskPrioritySelectOptions } from "@/features/tasks/utils/taskPrioritySelectOptions";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  priorities: LookupItem[];
  disabled?: boolean;
  required?: boolean;
};

/**
 * Standard priority dropdown (Low / Medium / High / Urgent) backed by lookup UUIDs.
 * Reused on task create and edit for consistent UX.
 */
export function TaskPrioritySelectField<T extends FieldValues>(props: Props<T>) {
  const options = buildTaskPrioritySelectOptions(props.priorities);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <Controller
        control={props.control}
        name={props.name}
        render={({ field, fieldState }) => (
          <>
            <FormFieldLabel required={props.required}>Priority</FormFieldLabel>
            <FormSelectField
              {...field}
              required={props.required}
              disabled={props.disabled}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              options={options}
            />
          </>
        )}
      />
    </Box>
  );
}
