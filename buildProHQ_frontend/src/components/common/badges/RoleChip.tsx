import Box from "@mui/material/Box";

export type RoleChipTone = "field" | "trade" | "mgmt";

export type RoleChipProps = {
  label: string;
  tone: RoleChipTone;
};

const TONE = {
  field: { bg: "#FFF3D4", color: "#E09010" },
  trade: { bg: "#F0FFF4", color: "#15803D" },
  mgmt: { bg: "#EEF2FF", color: "#3730A3" },
} as const;

export function RoleChip({ label, tone }: RoleChipProps) {
  const color = TONE[tone];
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: "20px",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        width: "fit-content",
        background: color.bg,
        color: color.color,
      }}
    >
      {label}
    </Box>
  );
}
