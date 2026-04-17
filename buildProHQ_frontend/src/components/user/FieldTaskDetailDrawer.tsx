"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { AppIcon } from "@/components/common/AppIcon";
import { AppAttachmentThumbnailsSkeleton } from "@/components/common/skeletons/AppAttachmentThumbnailsSkeleton";
import { ImageLightbox } from "@/components/common/ImageLightbox";
import { MESSAGES } from "@/constants/messages";
import type { TaskAttachmentItem } from "@/services/tasksApi.service";
import { htmlToPlainText } from "@/utils/richText";

export type FieldTaskDetailSummary = {
  id: string;
  filters: string;
  priority: string;
  desc: string;
  days: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  task: FieldTaskDetailSummary | null;
  attachments: TaskAttachmentItem[];
  attachmentsLoading: boolean;
};

function drawerFieldLabel(text: string) {
  return (
    <Typography
      sx={{
        fontSize: "11px",
        fontWeight: 700,
        color: "#7B89A8",
        textTransform: "uppercase",
        letterSpacing: "0.6px",
        mb: 0.25,
      }}
    >
      {text}
    </Typography>
  );
}

export function FieldTaskDetailDrawer({
  open,
  onClose,
  task,
  attachments,
  attachmentsLoading,
}: Props) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const beforePhotos = attachments.filter((a) => a.isBefore && !a.isAfter);

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 440 },
            p: "20px 22px",
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography
            sx={{
              fontFamily: "Rajdhani, sans-serif",
              fontSize: "18px",
              fontWeight: 700,
              color: "#1A2035",
            }}
          >
            {MESSAGES.task.detailDrawerTitle}
          </Typography>
          <IconButton
            onClick={onClose}
            aria-label={MESSAGES.task.detailDrawerClose}
            size="small"
            sx={{ color: "#7B89A8" }}
          >
            <AppIcon name="close" size={20} />
          </IconButton>
        </Box>

        {task ? (
          <>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px", mb: 2 }}>
              <Box>
                {drawerFieldLabel("Filters")}
                <Typography sx={{ fontFamily: "Rajdhani, sans-serif", fontSize: "16px", fontWeight: 700 }}>
                  {task.filters || "—"}
                </Typography>
              </Box>
              <Box>
                {drawerFieldLabel(MESSAGES.task.detailPriority)}
                <Typography sx={{ fontSize: "13px" }}>{task.priority}</Typography>
              </Box>
              <Box>
                {drawerFieldLabel(MESSAGES.task.detailDaysOpen)}
                <Typography sx={{ fontSize: "13px" }}>{task.days}d</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              {drawerFieldLabel(MESSAGES.task.detailDescription)}
              <Typography sx={{ fontSize: "14px", color: "#1A2035", lineHeight: 1.45 }}>
                {htmlToPlainText(task.desc)}
              </Typography>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#7B89A8",
                  textTransform: "uppercase",
                  letterSpacing: "0.7px",
                  mb: 1,
                }}
              >
                📷 {MESSAGES.task.beforePhotosHeading}
                {beforePhotos.length > 0 ? ` (${beforePhotos.length})` : ""}
              </Typography>

              {attachmentsLoading ? (
                <AppAttachmentThumbnailsSkeleton count={4} />
              ) : beforePhotos.length === 0 ? (
                <Box
                  sx={{
                    fontSize: "13px",
                    color: "#7B89A8",
                    p: "10px",
                    background: "#F8FAFC",
                    borderRadius: "8px",
                  }}
                >
                  {MESSAGES.task.beforePhotosEmpty}
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {beforePhotos.map((a) => (
                    <Box
                      key={a.id}
                      component="button"
                      type="button"
                      onClick={() => setLightboxSrc(a.fileUrl)}
                      sx={{
                        position: "relative",
                        width: 72,
                        height: 72,
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "2px solid #E4E8F0",
                        flexShrink: 0,
                        cursor: "pointer",
                        p: 0,
                        background: "none",
                      }}
                    >
                      <Box
                        component="img"
                        src={a.fileUrl}
                        alt=""
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                          pointerEvents: "none",
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: "rgba(0,0,0,0.55)",
                          color: "#fff",
                          fontSize: "8px",
                          fontWeight: 700,
                          textAlign: "center",
                          py: 0.25,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          pointerEvents: "none",
                        }}
                      >
                        {MESSAGES.taskForm.photoThumbLabel}
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </>
        ) : null}
      </Drawer>

      <ImageLightbox open={!!lightboxSrc} src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </>
  );
}
