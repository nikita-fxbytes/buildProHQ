import MenuItem from "@mui/material/MenuItem";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { formControlSx, mergeSx } from "@/components/common/fieldStyles";

export type FormSelectFieldOption = { value: string; label: string };

export type FormSelectFieldProps = Omit<TextFieldProps, "select"> & {
  options: FormSelectFieldOption[];
};

export function FormSelectField({ options, ...rest }: FormSelectFieldProps) {
  return (
    <TextField
      fullWidth
      size="small"
      select
      {...rest}
      sx={mergeSx(formControlSx, rest.sx)}
    >
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </TextField>
  );
}

