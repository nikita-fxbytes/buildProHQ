"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppButton } from "@/components/common/AppButton";
import { FormTextField } from "@/components/common/FormTextField";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import { MESSAGES } from "@/constants/messages";

type Comment = { id: string; comment: string; createdAt: string; createdBy: string };
type HistoryRow = { id: string; changeReason?: string | null; changedAt?: string | null; notes?: string | null };

export type TaskEditCommentsPanelsProps = {
  disabled: boolean;
  comments: Comment[];
  history: HistoryRow[];
  commentText: string;
  setCommentText: (v: string) => void;
  addComment: () => void;
};

/** Presentational comments + history blocks for the super-admin task edit page (outside the core TaskForm fields). */
export function TaskEditCommentsPanels(props: TaskEditCommentsPanelsProps) {
  const disabled = props.disabled;
  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>💬 Comments / Notes</Typography>
        <Stack spacing={1} sx={{ mb: 1.25 }}>
          {props.comments.length === 0 ? (
            <Typography sx={{ fontSize: 13, color: STYLE_TOKENS.colors.textMuted }}>
              {MESSAGES.task.commentsEmpty}
            </Typography>
          ) : (
            props.comments.slice(0, 20).map((c) => (
              <Box
                key={c.id}
                sx={{
                  border: `1px solid ${STYLE_TOKENS.colors.border}`,
                  borderRadius: "10px",
                  padding: "10px 12px",
                  background: "#FAFBFC",
                }}
              >
                <Typography sx={{ fontSize: 12, color: STYLE_TOKENS.colors.textMuted }}>
                  {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                </Typography>
                <Typography sx={{ fontSize: 13.5, mt: 0.25 }}>{c.comment}</Typography>
              </Box>
            ))
          )}
        </Stack>
        <Box sx={{ display: "flex", gap: 1 }}>
          <FormTextField
            value={props.commentText}
            onChange={(e) => props.setCommentText(e.target.value)}
            placeholder="Add a note or comment..."
            disabled={disabled}
          />
          <AppButton type="button" onClick={props.addComment} disabled={disabled || !props.commentText.trim()}>
            Add
          </AppButton>
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>📜 Task History</Typography>
        <Stack spacing={1}>
          {props.history.length === 0 ? (
            <Typography sx={{ fontSize: 13, color: STYLE_TOKENS.colors.textMuted }}>
              {MESSAGES.task.historyEmpty}
            </Typography>
          ) : (
            props.history.slice(0, 12).map((h) => (
              <Box
                key={h.id}
                sx={{
                  border: `1px solid ${STYLE_TOKENS.colors.border}`,
                  borderRadius: "10px",
                  padding: "10px 12px",
                  background: "#FAFBFC",
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{h.changeReason || "Update"}</Typography>
                <Typography sx={{ fontSize: 12, color: STYLE_TOKENS.colors.textMuted }}>
                  {h.changedAt ? new Date(h.changedAt).toLocaleString() : ""}
                </Typography>
                {h.notes ? <Typography sx={{ fontSize: 12.5, mt: 0.5 }}>{h.notes}</Typography> : null}
              </Box>
            ))
          )}
        </Stack>
      </Box>
    </>
  );
}
