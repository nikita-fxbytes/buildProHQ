import { createTheme } from "@mui/material/styles";
import { STYLE_TOKENS } from "@/constants/style-tokens";

export const appTheme = createTheme({
  typography: {
    fontFamily: STYLE_TOKENS.typography.fontBody,
  },
  palette: {
    background: {
      default: STYLE_TOKENS.colors.bg,
      paper: STYLE_TOKENS.colors.card,
    },
    text: {
      primary: STYLE_TOKENS.colors.text,
      secondary: STYLE_TOKENS.colors.textMuted,
    },
    primary: {
      main: STYLE_TOKENS.colors.orange,
    },
    secondary: {
      main: STYLE_TOKENS.colors.blue,
    },
    error: {
      main: STYLE_TOKENS.colors.red,
    },
    success: {
      main: STYLE_TOKENS.colors.green,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: STYLE_TOKENS.colors.bg,
          color: STYLE_TOKENS.colors.text,
          fontFamily: STYLE_TOKENS.typography.fontBody,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: STYLE_TOKENS.colors.text,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: STYLE_TOKENS.radius.card,
          boxShadow: STYLE_TOKENS.shadow.card,
          backgroundColor: STYLE_TOKENS.colors.card,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: STYLE_TOKENS.radius.control,
          fontFamily: STYLE_TOKENS.typography.fontDisplay,
          fontWeight: 700,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiFormHelperText-root": {
            fontSize: STYLE_TOKENS.typography.size.tableHead,
            marginLeft: 0,
            marginRight: 0,
            marginTop: 6,
          },
          "& .MuiOutlinedInput-root": {
            borderRadius: STYLE_TOKENS.radius.control,
            fontFamily: STYLE_TOKENS.typography.fontBody,
            fontSize: STYLE_TOKENS.typography.input.size,
            backgroundColor: STYLE_TOKENS.colors.card,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: STYLE_TOKENS.colors.border,
            borderWidth: 1.5,
          },
          "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: STYLE_TOKENS.colors.orange,
          },
          "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: STYLE_TOKENS.colors.orange,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: "10px 14px",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          fontFamily: STYLE_TOKENS.typography.fontBody,
          fontSize: STYLE_TOKENS.typography.input.size,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: STYLE_TOKENS.typography.fontBody,
          fontSize: STYLE_TOKENS.typography.size.bodySm,
          color: STYLE_TOKENS.colors.text,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: STYLE_TOKENS.radius.modal,
          boxShadow: STYLE_TOKENS.shadow.modal,
          border: `1.5px solid ${STYLE_TOKENS.colors.border}`,
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: STYLE_TOKENS.colors.border,
          "&.Mui-checked": {
            color: STYLE_TOKENS.colors.orange,
          },
          "&:hover": {
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: STYLE_TOKENS.radius.pill,
          fontWeight: 600,
        },
      },
    },
  },
});
