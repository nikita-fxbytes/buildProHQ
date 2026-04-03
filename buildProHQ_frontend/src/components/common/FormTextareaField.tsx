import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { formControlSx, mergeSx } from "@/components/common/fieldStyles";
import { compactHelperText } from "@/components/common/formField.utils";

export type FormTextareaFieldProps = TextFieldProps;

export function FormTextareaField({ helperText, ...props }: FormTextareaFieldProps) {
  return (
    <TextField
      fullWidth
      size="small"
      multiline
      minRows={3}
      {...props}
      helperText={compactHelperText(helperText)}
      sx={mergeSx(formControlSx, props.sx)}
    />
  );
}

