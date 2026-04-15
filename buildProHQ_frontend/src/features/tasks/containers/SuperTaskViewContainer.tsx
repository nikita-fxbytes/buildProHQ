"use client";

import { useParams } from "next/navigation";
import { SuperTaskView } from "@/features/tasks/super-admin/SuperTaskView";
import { useSuperTaskViewController } from "@/features/tasks/hooks/useSuperTaskViewController";
import { isUuidV4, taskIdFromParams } from "@/utils/taskRouteParams";
import Typography from "@mui/material/Typography";

export function SuperTaskViewContainer() {
  const params = useParams();
  const taskId = taskIdFromParams(params?.taskId);
  if (!isUuidV4(taskId)) {
    return (
      <Typography sx={{ p: 2, fontWeight: 700 }} role="alert">
        This task link is invalid or incomplete.
      </Typography>
    );
  }
  const c = useSuperTaskViewController({ taskId });
  return <SuperTaskView {...c} />;
}
