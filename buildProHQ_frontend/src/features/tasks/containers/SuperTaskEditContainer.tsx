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
            <CircularProgress size={28} sx={{ color: "#F5A623" }} />
          </Box>
        ) : null}

        <Typography
          sx={{
            fontFamily: "Rajdhani, sans-serif",
            fontSize: 16,
            fontWeight: 700,
            color: "#1A2035",
            marginBottom: "14px",
            paddingBottom: "10px",
            borderBottom: "2px solid #E4E8F0",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          Edit Task
        </Typography>

        <form onSubmit={c.onSubmit} noValidate>
          <TaskFormView {...c.taskFormProps}>
            <TaskEditCommentsPanels
              disabled={c.disabled}
              comments={c.comments}
              history={c.history}
              commentText={c.commentText}
              setCommentText={c.setCommentText}
              commentFiles={c.commentFiles}
              setCommentFiles={c.setCommentFiles}
              addComment={c.addComment}
              loadMoreComments={c.loadMoreComments}
              commentsHasNext={c.commentsHasNext}
              commentsLoadingMore={c.commentsLoadingMore}
              loadMoreHistory={c.loadMoreHistory}
              historyHasNext={c.historyHasNext}
              historyLoadingMore={c.historyLoadingMore}
            />
          </TaskFormView>

          <Stack direction="row" spacing={1.25} sx={{ mt: "22px" }}>
            <AppButton
              type="submit"
              variant="contained"
              disabled={c.disabled}
              sx={{ background: "#F5A623", color: "#fff", "&:hover": { background: "#E09010" } }}
            >
              Save Changes
            </AppButton>
            <AppButton
              type="button"
              variant="outlined"
              disabled={c.disabled}
              onClick={c.onCancel}
              sx={{ borderColor: "#E4E8F0", color: "#1A2035", "&:hover": { borderColor: "#F5A623", color: "#F5A623" } }}
            >
              Cancel
            </AppButton>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
