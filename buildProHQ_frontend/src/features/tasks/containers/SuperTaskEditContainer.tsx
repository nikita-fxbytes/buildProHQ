"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { AppButton } from "@/components/common/AppButton";
import { TaskFormView } from "@/features/tasks/task-form/TaskFormView";
import { TaskEditCommentsPanels } from "@/features/tasks/task-form/TaskEditCommentsPanels";
import { useTaskFormController } from "@/features/tasks/task-form/taskFormController";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import { isUuidV4 } from "@/utils/taskRouteParams";

export function SuperTaskEditContainer(props: { taskId: string }) {
  if (!isUuidV4(props.taskId)) {
    return (
      <Typography sx={{ p: 2, fontWeight: 700 }} role="alert">
        This task link is invalid or incomplete.
      </Typography>
    );
  }

  const c = useTaskFormController({ mode: "edit", taskId: props.taskId });

  return (
    <Box sx={{ maxWidth: "840px" }}>
      <Typography
        sx={{
          fontFamily: STYLE_TOKENS.typography.fontDisplay,
          fontSize: 22,
          fontWeight: 800,
          color: STYLE_TOKENS.colors.text,
          mb: 2,
        }}
      >
        Edit Task
      </Typography>

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
        {c.loading ? (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.7)",
              zIndex: 2,
              borderRadius: "12px",
            }}
          >
            <CircularProgress size={28} sx={{ color: STYLE_TOKENS.colors.orange }} />
          </Box>
        ) : null}

        <Typography
          sx={{
            fontFamily: STYLE_TOKENS.typography.fontDisplay,
            fontSize: 16,
            fontWeight: 700,
            color: STYLE_TOKENS.colors.text,
            marginBottom: "14px",
            paddingBottom: "10px",
            borderBottom: `2px solid ${STYLE_TOKENS.colors.border}`,
          }}
        >
          ✏️ Edit Task
        </Typography>

        <form onSubmit={c.onSubmit} noValidate>
          <TaskFormView {...c.taskFormProps}>
            <TaskEditCommentsPanels
              disabled={c.disabled}
              comments={c.comments}
              history={c.history}
              commentText={c.commentText}
              setCommentText={c.setCommentText}
              addComment={c.addComment}
            />
          </TaskFormView>

          <Stack direction="row" justifyContent="flex-end" spacing={1.25} sx={{ mt: 3 }}>
            <AppButton variant="contained" type="submit" disabled={c.disabled}>
              💾 Save Changes
            </AppButton>
            <AppButton variant="outlined" type="button" onClick={c.onCancel} disabled={c.disabled}>
              Cancel
            </AppButton>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
