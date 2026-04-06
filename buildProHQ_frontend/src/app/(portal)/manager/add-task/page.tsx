import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function ManagerAddTaskPage() {
  // Legacy route: keep for backwards-compat and avoid placeholder UI.
  // Redirect to the real Manager Add Task screen.
  redirect(ROUTES.MANAGER_ADD_TASK);
}
