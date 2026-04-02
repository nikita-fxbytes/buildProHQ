import InputAdornment from "@mui/material/InputAdornment";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import { AppIcon } from "@/components/common/AppIcon";
import { mergeSx, searchControlSx } from "@/components/common/fieldStyles";
import { STYLE_TOKENS } from "@/constants/style-tokens";

export type SearchInputProps = Omit<TextFieldProps, "onChange"> & {
  onChange?: (value: string) => void;
};

export function SearchInput({ onChange, ...rest }: SearchInputProps) {
  return (
    <TextField
      fullWidth
      size="small"
      {...rest}
      onChange={(e) => onChange?.(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <AppIcon name="search" size={13} sx={{ color: STYLE_TOKENS.colors.textMuted }} />
          </InputAdornment>
        ),
        ...(rest.InputProps || {}),
      }}
      sx={mergeSx(searchControlSx, rest.sx)}
    />
  );
}

