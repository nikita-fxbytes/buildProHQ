import type { ReactNode } from "react";
import { EmptyState } from "@/components/common/EmptyState";

export type AppTableEmptyStateProps = {
  icon?: ReactNode;
  message: string;
};

export function AppTableEmptyState({ icon, message }: AppTableEmptyStateProps) {
  return <EmptyState icon={icon} message={message} />;
}
