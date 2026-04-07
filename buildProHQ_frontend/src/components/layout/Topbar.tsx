"use client";

import { useMemo, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import { AppIcon } from "@/components/common/AppIcon";
import { useNotificationsController } from "@/features/notifications/hooks/useNotificationsController";
import { NotificationsPanel } from "@/components/notifications/NotificationsPanel";

export type TopbarProps = {
  title: string;
  breadcrumb?: string;
};

export function Topbar({ title, breadcrumb }: TopbarProps) {
  const notif = useNotificationsController();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const open = Boolean(anchorEl) && notif.open;
  const id = open ? "notifications-popover" : undefined;

  const unreadDot = useMemo(() => {
    if (!notif.hasUnread) return null;
    return (
      <Box
        component="span"
        sx={{
          position: "absolute",
          top: 7,
          right: 7,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#F5A623",
          boxShadow: "0 0 0 2px #fff",
        }}
      />
    );
  }, [notif.hasUnread]);

  return (
    <Box
      sx={{
        background: STYLE_TOKENS.colors.card,
        borderBottom: `1px solid ${STYLE_TOKENS.colors.border}`,
        paddingInline: "28px",
        height: `${STYLE_TOKENS.spacing.topbarHeight}px`,
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <Box>
        <Typography
          sx={{
            fontFamily: STYLE_TOKENS.typography.fontDisplay,
            fontSize: STYLE_TOKENS.typography.size.h5,
            fontWeight: 700,
            color: STYLE_TOKENS.colors.text,
            lineHeight: 1.1,
          }}
        >
          {title}
        </Typography>
        <Typography sx={{ fontSize: STYLE_TOKENS.typography.size.label, color: STYLE_TOKENS.colors.textMuted, marginTop: "1px" }}>
          {breadcrumb ?? ""}
        </Typography>
      </Box>
      <Box sx={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
        <Box sx={{ position: "relative" }}>
          <IconButton
            aria-describedby={id}
            onClick={(e) => {
              setAnchorEl(e.currentTarget);
              notif.setOpen(true);
            }}
            title="Notifications"
            sx={{
              width: 38,
              height: 38,
              borderRadius: "9px",
              border: "1px solid #E4E8F0",
              background: "#FFFFFF",
              "&:hover": { background: "#FAFBFF" },
            }}
          >
            <AppIcon name="notifications" size={20} />
          </IconButton>
          {unreadDot}
        </Box>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={() => {
            notif.setOpen(false);
            setAnchorEl(null);
          }}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{ sx: { background: "transparent", boxShadow: "none" } }}
        >
          <NotificationsPanel
            loading={notif.loading}
            items={notif.items}
            onClose={() => {
              notif.setOpen(false);
              setAnchorEl(null);
            }}
            onMarkAllRead={notif.markAllRead}
            onMarkRead={notif.markRead}
          />
        </Popover>
      </Box>
    </Box>
  );
}
