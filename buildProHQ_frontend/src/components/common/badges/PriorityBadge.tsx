import Box from "@mui/material/Box";

export type PriorityBadgeProps = {
  label?: string | null;
};

const toneFor = (label?: string | null) => {
  const key = (label ?? "").trim().toLowerCase();
  if (!key) return { bg: "#F3F4F6", fg: "#6B7280" }; // gray
  if (key.includes("critical")) return { bg: "#FEE2E2", fg: "#EF4444" };
  if (key.includes("high")) return { bg: "#FFE4E6", fg: "#E11D48" };
  if (key.includes("medium")) return { bg: "#FFF7ED", fg: "#EA580C" };
  if (key.includes("low")) return { bg: "#F0F9FF", fg: "#3BB0D8" };
  return { bg: "#EEF2FF", fg: "#3730A3" };
};

export function PriorityBadge({ label }: PriorityBadgeProps) {
  const tone = toneFor(label);
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        px: "10px",
        py: "4px",
        borderRadius: "999px",
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: "0.6px",
        textTransform: "uppercase",
        background: tone.bg,
        color: tone.fg,
        lineHeight: 1,
        width: "fit-content",
      }}
    >
      {(label ?? "-").toString()}
    </Box>
  );
}

