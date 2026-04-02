import type { SxProps, Theme } from "@mui/material/styles";
import { STYLE_TOKENS } from "@/constants/style-tokens";

export const mergeSx = (...styles: Array<SxProps<Theme> | undefined>): SxProps<Theme> =>
  styles.filter(Boolean) as SxProps<Theme>;

export const formControlSx: SxProps<Theme> = {
  "& .MuiInputBase-root": {
    fontSize: STYLE_TOKENS.typography.input.size,
    backgroundColor: STYLE_TOKENS.colors.card,
    borderRadius: `${STYLE_TOKENS.radius.control}px`,
    fontFamily: STYLE_TOKENS.typography.fontBody,
  },
  "& .MuiOutlinedInput-input": {
    padding: "10px 14px",
  },
  "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
    borderColor: STYLE_TOKENS.colors.border,
    borderWidth: 1.5,
  },
  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: STYLE_TOKENS.colors.orange,
  },
  "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: STYLE_TOKENS.colors.orange,
  },
};

export const searchControlSx: SxProps<Theme> = {
  ...formControlSx,
  "& .MuiOutlinedInput-input": {
    padding: "9px 14px 9px 8px",
  },
};

export const autocompleteControlSx: SxProps<Theme> = {
  ...formControlSx,
  "& .MuiInputBase-root": {
    fontSize: STYLE_TOKENS.typography.input.size,
    backgroundColor: STYLE_TOKENS.colors.card,
    borderRadius: `${STYLE_TOKENS.radius.control}px`,
    fontFamily: STYLE_TOKENS.typography.fontBody,
    minHeight: "42px",
    paddingRight: "32px !important",
  },
  "& .MuiAutocomplete-popupIndicator": {
    color: STYLE_TOKENS.colors.textMuted,
  },
};

export const autocompletePaperSx: SxProps<Theme> = {
  border: `1.5px solid ${STYLE_TOKENS.colors.border}`,
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  borderRadius: `${STYLE_TOKENS.radius.control}px`,
};

export const autocompleteListboxSx: SxProps<Theme> = {
  fontSize: STYLE_TOKENS.typography.input.size,
  color: STYLE_TOKENS.colors.text,
  "& .MuiAutocomplete-option": {
    minHeight: "36px",
    fontFamily: STYLE_TOKENS.typography.fontBody,
  },
};
