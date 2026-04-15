"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AppButton } from "@/components/common/AppButton";
import { TaskFormView } from "@/features/tasks/task-form/TaskFormView";
import { useTaskFormController } from "@/features/tasks/task-form/taskFormController";

export function ManagerAddTaskContainer(props: { mode?: "manager" | "super" }) {
  const portal = props.mode ?? "manager";
  const c = useTaskFormController({ mode: "create", portal });

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
          <span aria-hidden>📋</span> New Action Item
        </Typography>

        <form onSubmit={c.onSubmit} noValidate>
          <TaskFormView {...c.taskFormProps} />
          <Stack direction="row" spacing={1.25} sx={{ mt: "22px" }}>
            <AppButton
              type="submit"
              variant="contained"
              disabled={c.disabled}
              sx={{ background: "#F5A623", color: "#fff", "&:hover": { background: "#E09010" } }}
            >
              + Add Action Item
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
