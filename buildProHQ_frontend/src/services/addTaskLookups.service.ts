import { MESSAGES } from "@/constants/messages";
import { lookupsApi } from "@/services/lookupsApi.service";

export type AddTaskLookups = {
  levels: Awaited<ReturnType<typeof lookupsApi.getLevels>>;
  trades: Awaited<ReturnType<typeof lookupsApi.getTrades>>;
  priorities: Awaited<ReturnType<typeof lookupsApi.getTaskPriorities>>;
  openStatusId: string;
  defaultPriorityId: string;
};

export async function loadAddTaskLookups(): Promise<AddTaskLookups> {
  const [levels, trades, priorities, statuses] = await Promise.all([
    lookupsApi.getLevels(),
    lookupsApi.getTrades(),
    lookupsApi.getTaskPriorities(),
    lookupsApi.getTaskStatuses(),
  ]);

  const open = statuses.find((s) => s.code === "open");
  const medium = priorities.find((p) => p.code === "medium");

  if (!open) {
    throw new Error(MESSAGES.validation.openStatusMissing);
  }
  if (!medium) {
    throw new Error(MESSAGES.validation.priorityDefaultMissing);
  }

  return {
    levels,
    trades,
    priorities,
    openStatusId: open.id,
    defaultPriorityId: medium.id,
  };
}

