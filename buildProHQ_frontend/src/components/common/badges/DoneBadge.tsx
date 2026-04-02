import { AppIcon } from "@/components/common/AppIcon";

export type DoneBadgeProps = {
  label: string;
};

export function DoneBadge({ label }: DoneBadgeProps) {
  return (
    <span className="done-badge">
      <AppIcon name="complete" size={12} sx={{ mr: 0.25 }} />
      {label}
    </span>
  );
}
