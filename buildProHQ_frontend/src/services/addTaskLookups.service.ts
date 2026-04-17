import { MESSAGES } from "@/constants/messages";
import { lookupsApi } from "@/services/lookupsApi.service";

export type AddTaskLookups = {
  priorities: Awaited<ReturnType<typeof lookupsApi.getTaskPriorities>>;
  openStatusId: string;
  defaultPriorityId: string;
};

export async function loadAddTaskLookups(): Promise<AddTaskLookups> {
  const [priorities, statuses] = await Promise.all([lookupsApi.getTaskPriorities(), lookupsApi.getTaskStatuses()]);

  const open = statuses.find((s) => s.code === "open");
  const medium = priorities.find((p) => p.code === "medium");

  if (!open) {
    throw new Error(MESSAGES.validation.openStatusMissing);
  }
  if (!medium) {
    throw new Error(MESSAGES.validation.priorityDefaultMissing);
  }

  return {
    priorities,
    openStatusId: open.id,
    defaultPriorityId: medium.id,
  };
}

