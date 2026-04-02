import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { formControlSx, mergeSx } from "@/components/common/fieldStyles";

export type FormTextareaFieldProps = TextFieldProps;

export function FormTextareaField(props: FormTextareaFieldProps) {
  return (
    <TextField
      fullWidth
      size="small"
      multiline
      minRows={3}
      {...props}
      sx={mergeSx(formControlSx, props.sx)}
    />
  );
}

