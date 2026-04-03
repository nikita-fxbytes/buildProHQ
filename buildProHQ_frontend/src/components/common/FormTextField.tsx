import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { formControlSx, mergeSx } from "@/components/common/fieldStyles";
import { compactHelperText } from "@/components/common/formField.utils";

export type FormTextFieldProps = TextFieldProps;

export function FormTextField({ helperText, ...props }: FormTextFieldProps) {
  return (
    <TextField
      fullWidth
      size="small"
      {...props}
      helperText={compactHelperText(helperText)}
      sx={mergeSx(formControlSx, props.sx)}
    />
  );
}

