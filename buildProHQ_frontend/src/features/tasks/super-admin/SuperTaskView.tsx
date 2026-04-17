"use client";

import type { ReactNode } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppButton } from "@/components/common/AppButton";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import { MESSAGES } from "@/constants/messages";
import type { TaskAttachmentItem, TaskDetailResponse } from "@/services/tasksApi.service";
import { sanitizeRichHtml } from "@/utils/richText";
import { formatResolvedTaskFilters } from "@/utils/taskFilters";
import { TaskStatusBadge } from "@/components/common/badges/TaskStatusBadge";
import { PriorityBadge } from "@/components/common/badges/PriorityBadge";
import { TaskTimeline, type TaskTimelineItem } from "@/features/tasks/components/TaskTimeline";
import { timeAgo } from "@/utils/timeAgo";

type Props = {
  loading: boolean;
  task: TaskDetailResponse | null;
  comments: Array<{
    id: string;
    comment: string;
    created_at: string;
    created_by_full_name?: string | null;
    attachments?: Array<{ url: string; name: string }>;
  }>;
  history: Array<{
    id: string;
    change_reason?: string;
    changed_at?: string;
    changed_by_full_name?: string | null;
    old_status_name?: string | null;
    new_status_name?: string | null;
    metadata?: unknown;
    notes?: string | null;
  }>;
  attachments: TaskAttachmentItem[];
  assigneeLabel: string;
  daysToDeadline: number | null;
  deadlineLabel: string;
  onBack: () => void;
  onEdit: () => void;
};

function FieldBlock(props: { label: string; children: ReactNode }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 800,
          color: STYLE_TOKENS.colors.textMuted,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          mb: 0.75,
        }}
      >
        {props.label}
      </Typography>
      {props.children}
    </Box>
  );
}

export function SuperTaskView(props: Props) {
  const t = props.task;
  const comments = Array.isArray(props.comments) ? props.comments : [];
  const history = Array.isArray(props.history) ? props.history : [];
  const resolvedFilters = formatResolvedTaskFilters(t?.filters);

  const avatarLetter = (fullName?: string | null) => {
    const s = String(fullName ?? "").trim();
    return (s[0] ?? "U").toUpperCase();
  };

  return (
    <Box sx={{ maxWidth: "640px" }}>
      <Paper
        elevation={0}
        sx={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
          padding: "28px 32px",
          position: "relative",
        }}
      >
        {props.loading ? (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.75)",
              zIndex: 2,
              borderRadius: "12px",
            }}
          >
            <CircularProgress size={28} sx={{ color: STYLE_TOKENS.colors.orange }} />
          </Box>
        ) : null}

        {!props.loading && !t ? (
          <Typography sx={{ fontWeight: 700 }} role="alert">
            Task could not be loaded.
          </Typography>
        ) : null}

        {t ? (
          <>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 2, pb: 1.25, borderBottom: "2px solid #E4E8F0" }}
              spacing={2}
            >
              <Typography
                sx={{
                  fontFamily: "Rajdhani, sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#1A2035",
                }}
              >
                {String(t.title ?? "").trim() || "Task"}
              </Typography>
              <Stack direction="row" spacing={1}>
                <AppButton type="button" variant="outlined" size="small" onClick={props.onBack}>
                  Back
                </AppButton>
                <AppButton
                  type="button"
                  variant="contained"
                  size="small"
                  onClick={props.onEdit}
                  disabled={!t || props.loading}
                  sx={{ background: "#F5A623", color: "#fff", "&:hover": { background: "#E09010" } }}
                >
                  Edit
                </AppButton>
              </Stack>
            </Stack>

            <FieldBlock label="Project">
              <Typography sx={{ fontSize: 15, fontWeight: 700 }}>{t.project_name ?? "—"}</Typography>
            </FieldBlock>

            <FieldBlock label="Description">
              <Box
                sx={{
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: STYLE_TOKENS.colors.text,
                  "& p": { margin: "0 0 0.5em" },
                }}
                dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(String(t.description ?? "")) }}
              />
            </FieldBlock>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <FieldBlock label="Status">
                <TaskStatusBadge label={String(t.status_name ?? "Open")} />
              </FieldBlock>
              <FieldBlock label="Priority">
                <PriorityBadge label={String(t.priority_name ?? "-")} />
              </FieldBlock>
            </Box>

            <FieldBlock label="Filters">
              {resolvedFilters.length ? (
                <Stack spacing={0.5}>
                  {resolvedFilters.map((line) => (
                    <Typography key={line} sx={{ fontSize: 13.5 }}>
                      {line}
                    </Typography>
                  ))}
                </Stack>
              ) : (
                <Typography sx={{ fontSize: 13.5, color: STYLE_TOKENS.colors.textMuted }}>—</Typography>
              )}
            </FieldBlock>

            <FieldBlock label="Assigned user">
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{props.assigneeLabel}</Typography>
            </FieldBlock>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <FieldBlock label="Days to deadline">
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 800,
                    color:
                      props.daysToDeadline === null
                        ? STYLE_TOKENS.colors.textMuted
                        : props.daysToDeadline < 0
                          ? "#B91C1C"
                          : STYLE_TOKENS.colors.text,
                  }}
                >
                  {props.daysToDeadline === null
                    ? "—"
                    : props.daysToDeadline === 0
                      ? MESSAGES.task.dueToday
                      : `${props.daysToDeadline}d`}
                </Typography>
              </FieldBlock>
              <FieldBlock label="Deadline">
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    color:
                      props.daysToDeadline !== null && props.daysToDeadline < 0 ? "#B91C1C" : STYLE_TOKENS.colors.text,
                  }}
                >
                  {props.deadlineLabel || MESSAGES.task.deadlineNotSet}
                </Typography>
              </FieldBlock>
            </Box>

            {props.attachments.length > 0 ? (
              <FieldBlock label="Attachments">
                <Stack spacing={1}>
                  {props.attachments.map((a) => (
                    <Typography key={a.id} sx={{ fontSize: 13 }}>
                      <Box
                        component="a"
                        href={a.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{ color: STYLE_TOKENS.colors.blue, fontWeight: 700 }}
                      >
                        {a.fileName}
                      </Box>{" "}
                      {a.isBefore ? "(before)" : null}
                      {a.isAfter ? "(after)" : null}
                    </Typography>
                  ))}
                </Stack>
              </FieldBlock>
            ) : null}

            <FieldBlock label="Comments">
              <Stack spacing={1} sx={{ mb: 1 }}>
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
              </Stack>
            </FieldBlock>

            <FieldBlock label="History">
              {history.length === 0 ? (
                <Typography sx={{ fontSize: 13, color: STYLE_TOKENS.colors.textMuted }}>
                  {MESSAGES.task.historyEmpty}
                </Typography>
              ) : (
                <TaskTimeline items={history.slice(0, 40) as TaskTimelineItem[]} />
              )}
            </FieldBlock>
          </>
        ) : null}
      </Paper>
    </Box>
  );
}
