import Box from "@mui/material/Box";

export type TaskStatusBadgeProps = {
  label?: string | null;
};

const toneFor = (label?: string | null) => {
  const key = (label ?? "").trim().toLowerCase();
  if (!key) return { bg: "#F3F4F6", fg: "#6B7280" }; // gray
  if (key === "open" || key.includes("open")) return { bg: "#E0F2FE", fg: "#0284C7" }; // blue
  if (key.includes("progress")) return { bg: "#FFF7ED", fg: "#EA580C" }; // orange
  if (key.includes("complete")) return { bg: "#DCFCE7", fg: "#16A34A" }; // green
  return { bg: "#EEF2FF", fg: "#3730A3" };
};

export function TaskStatusBadge({ label }: TaskStatusBadgeProps) {
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

