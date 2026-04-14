"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import type { UserListItem } from "@/services/usersApi.service";

export type SuperUserListItemProps = {
  user: UserListItem;
  avatarBg: string;
  onDetails: (u: UserListItem) => void;
};

function MiniBadge({
  strong,
  label,
  borderStyle = "default",
}: {
  strong: number;
  label: string;
  borderStyle?: "default" | "overdue";
}) {
  const border = borderStyle === "overdue" ? "#FECACA" : STYLE_TOKENS.colors.border;
  const bg = borderStyle === "overdue" ? "#FFF7ED" : "#fff";
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "5px 10px",
        borderRadius: "999px",
        fontSize: 12,
        fontWeight: 700,
        border: `1.5px solid ${border}`,
        color: STYLE_TOKENS.colors.text,
        background: bg,
      }}
    >
      <Box component="strong" sx={{ fontFamily: STYLE_TOKENS.typography.fontDisplay, fontSize: 14 }}>
        {strong}
      </Box>
      {label}
    </Box>
  );
}

export function SuperUserListItem({ user, avatarBg, onDetails }: SuperUserListItemProps) {
  const initials = (user.initials || "?").toUpperCase();
  const open = user.open_tasks_count ?? 0;
  const done = user.completed_tasks_count ?? 0;
  const overdue = user.overdue_tasks_count ?? 0;

  return (
    <Box
      sx={{
        border: `1.5px solid ${STYLE_TOKENS.colors.border}`,
        borderRadius: "12px",
        padding: "12px",
        background: "#fff",
        boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "flex-start" },
        justifyContent: "space-between",
        gap: "12px",
        "&:hover": {
          borderColor: STYLE_TOKENS.colors.orange,
          background: "#FAFBFF",
        },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: "12px", minWidth: { md: "280px" } }}>
        <Box
          sx={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: STYLE_TOKENS.typography.fontDisplay,
            fontSize: 16,
            fontWeight: 800,
            color: "#fff",
            background: avatarBg,
            flexShrink: 0,
          }}
        >
          {initials}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: STYLE_TOKENS.typography.fontDisplay,
              fontSize: 16,
              fontWeight: 800,
              color: STYLE_TOKENS.colors.text,
              lineHeight: 1.1,
            }}
          >
            {user.full_name}
          </Typography>
          <Typography sx={{ fontSize: 12, color: STYLE_TOKENS.colors.textMuted, marginTop: "3px" }}>
            {user.email}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <MiniBadge strong={open} label="Open" />
          <MiniBadge strong={done} label="Completed" />
          <MiniBadge strong={overdue} label="Overdue" borderStyle="overdue" />
        </Box>
        <Typography sx={{ fontSize: 12, color: STYLE_TOKENS.colors.textMuted }}>
          Click &quot;Details&quot; to view projects + recent tasks.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: { xs: "flex-end", md: "flex-end" } }}>
        <Box
          component="button"
          type="button"
          onClick={() => onDetails(user)}
          sx={{
            border: `1.5px solid ${STYLE_TOKENS.colors.border}`,
            background: "#fff",
            color: STYLE_TOKENS.colors.text,
            borderRadius: "10px",
            padding: "8px 10px",
            fontSize: 12,
            fontWeight: 800,
            fontFamily: STYLE_TOKENS.typography.fontDisplay,
            cursor: "pointer",
            "&:hover": {
              borderColor: STYLE_TOKENS.colors.orange,
              color: STYLE_TOKENS.colors.orange,
            },
          }}
        >
          Details
        </Box>
      </Box>
    </Box>
  );
}
