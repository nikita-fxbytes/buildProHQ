export type InitialsBadgeProps = {
  initials: string;
};

export function InitialsBadge({ initials }: InitialsBadgeProps) {
  return <span className="initials-badge">{initials}</span>;
}
