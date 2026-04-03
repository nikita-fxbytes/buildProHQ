import Typography from "@mui/material/Typography";
import type { SxProps, Theme } from "@mui/material/styles";

type FormFieldLabelProps = {
  children: React.ReactNode;
  required?: boolean;
  sx?: SxProps<Theme>;
};

export function FormFieldLabel({ children, required, sx }: FormFieldLabelProps) {
  return (
    <Typography
      sx={{
        fontSize: 12,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.7px",
        color: "#7B89A8",
        display: "inline-flex",
        alignItems: "center",
        gap: 0.25,
        ...sx,
      }}
    >
      <span>{children}</span>
      {required ? (
        <span
          aria-hidden="true"
          style={{ color: "#EF4444", marginLeft: 2, fontSize: "12px", lineHeight: 1 }}
        >
          *
        </span>
      ) : null}
    </Typography>
  );
}

