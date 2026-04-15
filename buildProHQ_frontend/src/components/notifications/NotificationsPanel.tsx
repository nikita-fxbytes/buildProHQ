"use client";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppIcon } from "@/components/common/AppIcon";
import { AppButton } from "@/components/common/AppButton";
import type { NotificationItem } from "@/services/notificationsApi.service";
import { formatDateTime } from "@/utils/date";

export type NotificationsPanelProps = {
  loading: boolean;
  items: NotificationItem[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
};

export function NotificationsPanel({
  loading,
  items,
  onClose,
  onMarkAllRead,
  onMarkRead,
}: NotificationsPanelProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: 360,
        maxWidth: "92vw",
        borderRadius: "12px",
        border: "1px solid #E4E8F0",
        boxShadow: "0 12px 38px rgba(0,0,0,0.18)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, p: "12px 14px" }}>
        <Typography sx={{ fontSize: 14, fontWeight: 800, color: "#1A2035" }}>
          <span style={{ marginRight: 8 }}>🔔</span> Notifications
        </Typography>
        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 0.5 }}>
          <AppButton size="small" variant="outlined" onClick={onMarkAllRead} sx={{ fontSize: 12 }}>
            Mark all read
          </AppButton>
          <IconButton size="small" onClick={onClose} aria-label="Close notifications">
            <AppIcon name="close" size={16} />
          </IconButton>
        </Box>
      </Box>
      <Divider />

      <Box sx={{ maxHeight: 420, overflowY: "auto" }}>
        {loading ? (
          <Stack sx={{ p: 2 }} spacing={1.25}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Box key={i} sx={{ p: 1.25, borderRadius: 2, border: "1px solid #E4E8F0" }}>
                <Skeleton variant="text" width="82%" />
                <Skeleton variant="text" width="62%" />
              </Box>
            ))}
          </Stack>
        ) : items.length === 0 ? (
          <Box sx={{ p: 2, color: "#7B89A8", fontSize: 13 }}>No notifications.</Box>
        ) : (
          <Stack spacing={1} sx={{ p: 1.5 }}>
            {items.map((n) => (
              <Box
                key={n.id}
                role="button"
                tabIndex={0}
                onClick={() => !n.isRead && onMarkRead(n.id)}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && !n.isRead) {
                    e.preventDefault();
                    onMarkRead(n.id);
                  }
                }}
                sx={{
                  p: "10px 12px",
                  borderRadius: "10px",
                  border: "1px solid #E4E8F0",
                  cursor: n.isRead ? "default" : "pointer",
                  background: n.isRead ? "#FFFFFF" : "#FFF3D4",
                  transition: "background 0.15s",
                  "&:hover": {
                    background: n.isRead ? "#FAFBFF" : "#FFFBF2",
                  },
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: n.isRead ? 600 : 800, color: "#1A2035" }}>
                  {n.title || n.type || "Notification"}
                  {!n.isRead ? (
                    <Box component="span" sx={{ ml: 1, display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "#F5A623" }} />
                  ) : null}
                </Typography>
                {n.body ? (
                  <Typography sx={{ fontSize: 12, color: "#4B5563", mt: 0.5, lineHeight: 1.35 }}>
                    {n.body}
                  </Typography>
                ) : null}
                <Typography sx={{ fontSize: 11, color: "#7B89A8", mt: 0.75 }}>
                  {formatDateTime(n.createdAt)}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Paper>
  );
}

