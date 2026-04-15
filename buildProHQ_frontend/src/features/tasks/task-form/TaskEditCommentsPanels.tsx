"use client";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import { AppButton } from "@/components/common/AppButton";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import { MESSAGES } from "@/constants/messages";
import { TaskTimeline, type TaskTimelineItem } from "@/features/tasks/components/TaskTimeline";
import { timeAgo } from "@/utils/timeAgo";

type Comment = {
  id: string;
  comment: string;
  created_at: string;
  created_by_full_name?: string | null;
  attachments?: Array<{ url: string; name: string }>;
};
type HistoryRow = {
  id: string;
  change_reason?: string;
  changed_at?: string;
  changed_by_full_name?: string | null;
  old_status_name?: string | null;
  new_status_name?: string | null;
  metadata?: unknown;
  notes?: string | null;
};

export type TaskEditCommentsPanelsProps = {
  disabled: boolean;
  comments: Comment[];
  history: HistoryRow[];
  commentText: string;
  setCommentText: (v: string) => void;
  commentFiles: File[];
  setCommentFiles: (v: File[]) => void;
  addComment: () => void;
  loadMoreComments?: () => void;
  commentsHasNext?: boolean;
  commentsLoadingMore?: boolean;
  loadMoreHistory?: () => void;
  historyHasNext?: boolean;
  historyLoadingMore?: boolean;
};

/** Presentational comments + history blocks for the super-admin task edit page (outside the core TaskForm fields). */
export function TaskEditCommentsPanels(props: TaskEditCommentsPanelsProps) {
  const disabled = props.disabled;
  const comments = Array.isArray(props.comments) ? props.comments : [];
  const history = Array.isArray(props.history) ? props.history : [];
  const selectedFiles = Array.isArray(props.commentFiles) ? props.commentFiles : [];

  const avatarLetter = (fullName?: string | null) => {
    const s = String(fullName ?? "").trim();
    return (s[0] ?? "U").toUpperCase();
  };

  const sectionCardSx = {
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    boxShadow: "0 1px 2px rgba(16,24,40,0.06)",
    background: "#fff",
    mb: "12px",
  } as const;

  return (
    <>
      <Box sx={{ mt: 3, ...sectionCardSx }}>
        <Box sx={{ px: 1.5, py: 1.25, borderBottom: "1px solid #E5E7EB" }}>
          <Typography sx={{ fontSize: 13, fontWeight: 800, color: STYLE_TOKENS.colors.text }}>
            Comments
          </Typography>
        </Box>
        <Box
          sx={{
            maxHeight: 400,
            overflowY: "auto",
            pr: 0.5,
          }}
          onScroll={(e) => {
            const el = e.currentTarget;
            if (!props.commentsHasNext || props.commentsLoadingMore) return;
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) {
              props.loadMoreComments?.();
            }
          }}
        >
          <Stack spacing={1} sx={{ p: 1.5 }}>
            {comments.length === 0 ? (
              <Typography sx={{ fontSize: 13, color: STYLE_TOKENS.colors.textMuted }}>
                {MESSAGES.task.commentsEmpty}
              </Typography>
            ) : (
              comments.map((c) => {
                const who = String(c.created_by_full_name ?? "Unknown").trim() || "Unknown";
                const when = timeAgo(c.created_at);
                const attachments = Array.isArray(c.attachments) ? c.attachments : [];
                return (
                  <Box
                    key={c.id}
                    sx={{
                      background: "#fff",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      mb: 1,
                      borderLeft: "3px solid #e0e0e0",
                    }}
                  >
                    <Stack direction="row" spacing={1.25} alignItems="flex-start">
                      <Avatar
                        sx={{
                          width: 30,
                          height: 30,
                          fontSize: 12,
                          fontWeight: 800,
                          bgcolor: "#EEF2FF",
                          color: "#3730A3",
                        }}
                      >
                        {avatarLetter(c.created_by_full_name)}
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Stack
                          direction="row"
                          alignItems="baseline"
                          justifyContent="space-between"
                          sx={{ gap: 1 }}
                        >
                          <Typography
                            sx={{
                              fontSize: 13.5,
                              fontWeight: 800,
                              color: STYLE_TOKENS.colors.text,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                            title={who}
                          >
                            {who}
                          </Typography>
                          <Typography sx={{ fontSize: 11.5, color: STYLE_TOKENS.colors.textMuted }} title={when.title}>
                            {when.label}
                          </Typography>
                        </Stack>
                        <Typography
                          sx={{
                            fontSize: 13.5,
                            mt: 0.5,
                            color: STYLE_TOKENS.colors.text,
                            lineHeight: 1.55,
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                          }}
                        >
                          {String(c.comment ?? "").trim() || "—"}
                        </Typography>
                        {attachments.length ? (
                          <Stack spacing={0.5} sx={{ mt: 0.75 }}>
                            {attachments.map((a) => (
                              <Box
                                key={`${c.id}:${a.url}`}
                                component="a"
                                href={a.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  fontSize: 12.5,
                                  color: STYLE_TOKENS.colors.blue,
                                  fontWeight: 700,
                                  textDecoration: "none",
                                  "&:hover": { textDecoration: "underline" },
                                }}
                              >
                                📎 {a.name}
                              </Box>
                            ))}
                          </Stack>
                        ) : null}
                      </Box>
                    </Stack>
                  </Box>
                );
              })
            )}
          {props.commentsLoadingMore ? (
            <Typography sx={{ fontSize: 12, color: STYLE_TOKENS.colors.textMuted, textAlign: "center", py: 0.5 }}>
              Loading…
            </Typography>
          ) : null}
          </Stack>
        </Box>

        <Box
          sx={{
            background: "#fff",
            px: 1.5,
            py: 1.25,
            borderTop: "1px solid #E5E7EB",
            position: "sticky",
            bottom: 0,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              border: "1px solid #E5E7EB",
              borderRadius: "999px",
              px: 1,
              py: 0.5,
              background: "#fff",
            }}
          >
            <IconButton
              size="small"
              disabled={disabled}
              aria-label="Attach files"
              component="label"
            >
              <AttachFileRoundedIcon fontSize="small" />
              <input
                type="file"
                hidden
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  props.setCommentFiles(files);
                  e.currentTarget.value = "";
                }}
              />
            </IconButton>
            <Box
              component="textarea"
              value={props.commentText}
              onChange={(e) => props.setCommentText((e.target as HTMLTextAreaElement).value)}
              placeholder="Write a comment..."
              disabled={disabled}
              rows={1}
              style={{
                width: "100%",
                resize: "none",
                border: "none",
                outline: "none",
                fontSize: 13.5,
                lineHeight: 1.5,
                padding: "8px 6px",
                fontFamily: "inherit",
                background: "transparent",
              }}
            />
            <IconButton
              size="small"
              onClick={props.addComment}
              disabled={disabled || !props.commentText.trim()}
              aria-label="Send comment"
              sx={{
                bgcolor: STYLE_TOKENS.colors.orange,
                color: "#fff",
                "&:hover": { bgcolor: "#E09010" },
                "&.Mui-disabled": { bgcolor: "#F3F4F6", color: "#9CA3AF" },
              }}
            >
              <SendRoundedIcon fontSize="small" />
            </IconButton>
          </Box>
          {selectedFiles.length ? (
            <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
              {selectedFiles.map((f) => (
                <Box
                  key={f.name}
                  sx={{
                    fontSize: 12,
                    border: "1px solid #E5E7EB",
                    borderRadius: "999px",
                    px: 1,
                    py: 0.35,
                    background: "#FAFBFC",
                  }}
                >
                  {f.name}
                </Box>
              ))}
            </Stack>
          ) : null}
        </Box>
      </Box>

      <Box sx={{ mt: 0, ...sectionCardSx }}>
        <Box sx={{ px: 1.5, py: 1.25, borderBottom: "1px solid #E5E7EB" }}>
          <Typography sx={{ fontSize: 13, fontWeight: 800, color: STYLE_TOKENS.colors.text }}>
            Task History
          </Typography>
        </Box>
        <Box
          sx={{
            maxHeight: 400,
            overflowY: "auto",
            pr: 0.5,
          }}
          onScroll={(e) => {
            const el = e.currentTarget;
            if (!props.historyHasNext || props.historyLoadingMore) return;
            if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) {
              props.loadMoreHistory?.();
            }
          }}
        >
          <Box sx={{ p: 1.5 }}>
            {history.length === 0 ? (
              <Typography sx={{ fontSize: 13, color: STYLE_TOKENS.colors.textMuted }}>
                {MESSAGES.task.historyEmpty}
              </Typography>
            ) : (
              <TaskTimeline items={history as TaskTimelineItem[]} />
            )}
            {props.historyLoadingMore ? (
              <Typography sx={{ fontSize: 12, color: STYLE_TOKENS.colors.textMuted, textAlign: "center", py: 0.5 }}>
                Loading…
              </Typography>
            ) : null}
          </Box>
        </Box>
      </Box>
    </>
  );
}
