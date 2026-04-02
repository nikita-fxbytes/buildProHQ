import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { STYLE_TOKENS } from "@/constants/style-tokens";

export type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 2.5,
      }}
    >
      <Box>
        <Typography
          sx={{
            fontFamily: STYLE_TOKENS.typography.fontDisplay,
            fontSize: STYLE_TOKENS.typography.size.h3,
            fontWeight: 700,
            color: STYLE_TOKENS.colors.text,
          }}
        >
          {title}
        </Typography>
        {subtitle ? (
          <Typography sx={{ fontSize: STYLE_TOKENS.typography.size.bodySm, color: STYLE_TOKENS.colors.textMuted, marginTop: 0.5 }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {actions}
    </Box>
  );
}

