"use client";

import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import type { UserListItem } from "@/services/usersApi.service";
import type { SuperDashboardRoleTab } from "../taskUserMatch";
import { superTabAccent } from "../superDashboardUi";
import { SuperUserListItem } from "./SuperUserListItem";

export type SuperUserListProps = {
  loading: boolean;
  tab: SuperDashboardRoleTab;
  users: UserListItem[];
  onDetails: (u: UserListItem) => void;
};

export function SuperUserList({ loading, tab, users, onDetails }: SuperUserListProps) {
  const accent = superTabAccent(tab);

  if (loading) {
    return (
      <Stack spacing={1.25}>
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} variant="rounded" height={88} sx={{ borderRadius: "12px" }} />
        ))}
      </Stack>
    );
  }

  if (users.length === 0) {
    return (
      <Typography sx={{ fontSize: 13, color: STYLE_TOKENS.colors.textMuted, padding: "8px 2px" }}>
        No users in this role.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: 0 }}>
      {users.map((u) => (
        <SuperUserListItem key={u.id} user={u} avatarBg={accent} onDetails={onDetails} />
      ))}
    </Box>
  );
}
