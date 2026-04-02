import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { formControlSx, mergeSx } from "@/components/common/fieldStyles";

export type FormTextFieldProps = TextFieldProps;

export function FormTextField(props: FormTextFieldProps) {
  return (
    <TextField
      fullWidth
      size="small"
      {...props}
      sx={mergeSx(formControlSx, props.sx)}
    />
  );
}

