import Box from "@mui/material/Box";

export type DaysBadgeProps = {
  days: number;
};

export function DaysBadge({ days }: DaysBadgeProps) {
  return (
    <Box
      component="span"
      className="days-badge"
      sx={{
        background: days > 10 ? "#FEE2E2" : days > 6 ? "#FFF7ED" : "#F0F9FF",
        color: days > 10 ? "#EF4444" : days > 6 ? "#EA580C" : "#3BB0D8",
      }}
    >
      {days}d open
    </Box>
  );
}
