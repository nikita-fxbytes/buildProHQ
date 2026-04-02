import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { STYLE_TOKENS } from "@/constants/style-tokens";

export type StatCardProps = {
  value: number | string;
  label: string;
  accentColor: string;
};

export function StatCard({ value, label, accentColor }: StatCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        padding: "18px 20px",
        borderRadius: `${STYLE_TOKENS.radius.card}px`,
        borderLeft: `4px solid ${accentColor}`,
        boxShadow: STYLE_TOKENS.shadow.card,
      }}
    >
      <Typography
        sx={{
          fontFamily: STYLE_TOKENS.typography.fontDisplay,
          fontSize: STYLE_TOKENS.typography.size.h2,
          fontWeight: 700,
          color: STYLE_TOKENS.colors.text,
        }}
      >
        {value}
      </Typography>
      <Typography sx={{ fontSize: STYLE_TOKENS.typography.size.label, color: STYLE_TOKENS.colors.textMuted, marginTop: 0.5 }}>
        {label}
      </Typography>
    </Paper>
  );
}

