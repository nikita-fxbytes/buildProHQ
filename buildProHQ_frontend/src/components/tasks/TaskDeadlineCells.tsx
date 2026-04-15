"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import { computeDaysToDeadline, formatDeadlineDate } from "@/utils/taskDeadline";
import { MESSAGES } from "@/constants/messages";

type DaysProps = { daysToDeadline: number | null };

/** Days until deadline (deadline − today). Overdue uses urgent styling (HTML-aligned). */
export function TaskDaysToDueCell(props: DaysProps) {
  if (props.daysToDeadline === null) {
    return (
      <Typography sx={{ fontSize: 13, color: STYLE_TOKENS.colors.textMuted }}>—</Typography>
    );
  }
  const d = props.daysToDeadline;
  const urgent = d < 0;
  const warn = d >= 0 && d <= 6;
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "8px",
        px: 1,
        py: 0.25,
        fontSize: 12,
        fontWeight: 800,
        fontFamily: STYLE_TOKENS.typography.fontDisplay,
        border: urgent
          ? "1px solid #FECACA"
          : warn
            ? "1px solid #FED7AA"
            : `1px solid ${STYLE_TOKENS.colors.border}`,
        background: urgent ? "#FEF2F2" : warn ? "#FFF7ED" : "#F8FAFC",
        color: urgent ? "#B91C1C" : warn ? "#C2410C" : STYLE_TOKENS.colors.text,
      }}
    >
      ⏱ {d > 0 ? `${d}d` : d === 0 ? MESSAGES.task.dueToday : `${d}d`}
    </Box>
  );
}

type DeadlineProps = { dueAt: string | null | undefined };

export function TaskDeadlineDateCell(props: DeadlineProps) {
  const label = formatDeadlineDate(props.dueAt ?? null);
  const delta = computeDaysToDeadline(props.dueAt ?? null);
  const overdue = delta !== null && delta < 0;
  if (!label) {
    return (
      <Typography sx={{ fontSize: 12, color: STYLE_TOKENS.colors.textMuted }}>
        {MESSAGES.task.deadlineNotSet}
      </Typography>
    );
  }
  return (
    <Typography
      sx={{
        fontSize: 13,
        fontWeight: 600,
        color: overdue ? "#B91C1C" : STYLE_TOKENS.colors.text,
        px: overdue ? 0.75 : 0,
        py: overdue ? 0.25 : 0,
        borderRadius: overdue ? "8px" : 0,
        background: overdue ? "#FEF2F2" : "transparent",
        border: overdue ? "1px solid #FECACA" : "none",
        display: "inline-block",
      }}
    >
      {label}
    </Typography>
  );
}
