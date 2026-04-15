import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import { timeAgo } from "@/utils/timeAgo";

export type TaskTimelineItem = {
  id: string;
  change_reason?: string;
  changed_at?: string;
  changed_by_full_name?: string | null;
  old_status_name?: string | null;
  new_status_name?: string | null;
  metadata?: unknown;
  notes?: string | null;
};

function labelFor(h: TaskTimelineItem): string {
  const reason = (h.change_reason ?? "").toLowerCase();
  if (reason === "task_created") return "Task created";
  if (reason === "task_status_changed" && h.new_status_name) return `Status changed to ${h.new_status_name}`;
  if (reason === "task_assigned") return "Assignees updated";
  if (reason === "task_updated") return "Task updated";
  return h.change_reason ? h.change_reason.replaceAll("_", " ") : "Update";
}

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function groupLabelFor(changedAt?: string): string {
  if (!changedAt) return "Older";
  const d = new Date(changedAt);
  if (Number.isNaN(d.getTime())) return "Older";
  const today = startOfLocalDay(new Date());
  const day = startOfLocalDay(d);
  const diffDays = Math.round((today.getTime() - day.getTime()) / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return "Older";
}

export function TaskTimeline(props: { items: TaskTimelineItem[] }) {
  if (!props.items.length) {
    return (
      <Typography sx={{ fontSize: 13, color: STYLE_TOKENS.colors.textMuted }}>
        No history yet.
      </Typography>
    );
  }

  const grouped = props.items.reduce<Record<string, TaskTimelineItem[]>>((acc, item) => {
    const k = groupLabelFor(item.changed_at);
    (acc[k] ??= []).push(item);
    return acc;
  }, {});

  const order: Array<keyof typeof grouped> = ["Today", "Yesterday", "Older"].filter((k) => grouped[k]?.length) as any;

  return (
    <Stack spacing={1.5} sx={{ position: "relative" }}>
      {order.map((section) => (
        <Box key={section}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 900,
              color: STYLE_TOKENS.colors.textMuted,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              mb: 1,
            }}
          >
            {section}
          </Typography>
          <Stack spacing={1.25}>
            {grouped[section].map((h) => {
              const t = timeAgo(h.changed_at ?? null);
              return (
                <Stack key={h.id} direction="row" spacing={1.5} sx={{ position: "relative" }}>
                  <Box sx={{ width: 14, display: "flex", justifyContent: "center", position: "relative" }}>
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: "50%",
                        width: 2,
                        transform: "translateX(-50%)",
                        background: "#E5E7EB",
                      }}
                    />
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "999px",
                        background: STYLE_TOKENS.colors.orange,
                        mt: "4px",
                        border: "2px solid #fff",
                        zIndex: 1,
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      flex: 1,
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      background: "#fff",
                    }}
                  >
                    <Typography sx={{ fontSize: 13, fontWeight: 800 }}>{labelFor(h)}</Typography>
                    <Stack direction="row" spacing={0.75} sx={{ mt: 0.25, flexWrap: "wrap" }}>
                      <Typography sx={{ fontSize: 12, color: STYLE_TOKENS.colors.textMuted }}>
                        {h.changed_by_full_name ?? "—"}
                      </Typography>
                      {t.title ? (
                        <Tooltip title={t.title} arrow>
                          <Typography sx={{ fontSize: 12, color: STYLE_TOKENS.colors.textMuted, cursor: "help" }}>
                            {t.label}
                          </Typography>
                        </Tooltip>
                      ) : null}
                    </Stack>
                    {h.notes ? <Typography sx={{ fontSize: 12.5, mt: 0.5 }}>{h.notes}</Typography> : null}
                  </Box>
                </Stack>
              );
            })}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

