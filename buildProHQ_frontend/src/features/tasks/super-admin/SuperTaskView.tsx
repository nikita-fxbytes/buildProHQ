"use client";

import type { ReactNode } from "react";
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

type Props = {
  loading: boolean;
  task: TaskDetailResponse | null;
  comments: Array<{ id: string; comment: string; createdAt: string; createdBy: string }>;
  history: Array<{ id: string; changeReason?: string | null; changedAt?: string | null; notes?: string | null }>;
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

  return (
    <Box sx={{ maxWidth: "840px" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }} spacing={2}>
        <Typography
          sx={{
            fontFamily: STYLE_TOKENS.typography.fontDisplay,
            fontSize: 22,
            fontWeight: 800,
            color: STYLE_TOKENS.colors.text,
          }}
        >
          View Task
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
          >
            Edit
          </AppButton>
        </Stack>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          background: "#fff",
          borderRadius: "12px",
          boxShadow: STYLE_TOKENS.shadow.card,
          padding: "22px 22px",
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
            <FieldBlock label="Title">
              <Typography sx={{ fontSize: 16, fontWeight: 800 }}>{String(t.title ?? "").trim() || "—"}</Typography>
            </FieldBlock>

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
              <FieldBlock label="Level">
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{String(t.level_name ?? "—")}</Typography>
              </FieldBlock>
              <FieldBlock label="Trade">
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{String(t.trade_name ?? "—")}</Typography>
              </FieldBlock>
              <FieldBlock label="Status">
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{String(t.status_name ?? "—")}</Typography>
              </FieldBlock>
              <FieldBlock label="Priority">
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{String(t.priority_name ?? "—")}</Typography>
              </FieldBlock>
            </Box>

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
                {props.comments.length === 0 ? (
                  <Typography sx={{ fontSize: 13, color: STYLE_TOKENS.colors.textMuted }}>
                    {MESSAGES.task.commentsEmpty}
                  </Typography>
                ) : (
                  props.comments.map((c) => (
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
                        {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""} · {c.createdBy}
                      </Typography>
                      <Typography sx={{ fontSize: 13.5, mt: 0.25 }}>{c.comment}</Typography>
                    </Box>
                  ))
                )}
              </Stack>
            </FieldBlock>

            <FieldBlock label="History">
              <Stack spacing={1}>
                {props.history.length === 0 ? (
                  <Typography sx={{ fontSize: 13, color: STYLE_TOKENS.colors.textMuted }}>
                    {MESSAGES.task.historyEmpty}
                  </Typography>
                ) : (
                  props.history.map((h) => (
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
                      {h.notes ? (
                        <Typography sx={{ fontSize: 12.5, mt: 0.5 }}>{h.notes}</Typography>
                      ) : null}
                    </Box>
                  ))
                )}
              </Stack>
            </FieldBlock>
          </>
        ) : null}
      </Paper>
    </Box>
  );
}
