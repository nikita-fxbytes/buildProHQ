"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AppIcon } from "@/components/common/AppIcon";
import { AppButton } from "@/components/common/AppButton";
import { AppLogo } from "@/components/branding/AppLogo";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import { ROLES, type Role } from "@/constants/roles";
import { MESSAGES } from "@/constants/messages";
import { useAuth } from "@/contexts/AuthContext";
import { tasksApi } from "@/services/tasksApi.service";
import { usersApi } from "@/services/usersApi.service";
import { appToast } from "@/utils/toast";
import { TASKS_CHANGED_EVENT } from "@/utils/taskEvents";
import { getPortalNavSections, type SidebarBadgeState } from "@/navigation/portalNavConfig";
import type { AppIconProps } from "@/components/common/AppIcon";

export type PortalSidebarProps = {
  role: Role;
};

const ROLE_SIDEBAR_BG: Record<Role, string> = {
  [ROLES.FIELD_USER]: STYLE_TOKENS.colors.sidebarBg,
  [ROLES.TRADE_USER]: "#0F2117",
  [ROLES.MANAGER]: "#111827",
};

const ROLE_CARD_META: Record<Role, { roleLabel: string; avatarBg: string }> = {
  [ROLES.FIELD_USER]: { roleLabel: "Field User", avatarBg: STYLE_TOKENS.colors.orange },
  [ROLES.TRADE_USER]: { roleLabel: "Trade User", avatarBg: STYLE_TOKENS.colors.green },
  [ROLES.MANAGER]: { roleLabel: "Manager / Admin", avatarBg: STYLE_TOKENS.colors.blue },
};

function isNavActive(pathname: string, itemHref: string): boolean {
  return pathname === itemHref || pathname.startsWith(`${itemHref}/`);
}

export function PortalSidebar({ role }: PortalSidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [badges, setBadges] = useState<SidebarBadgeState>({
    openTasks: 0,
    completedTasks: 0,
    users: 0,
    tradeAssigned: 0,
    tradeCompleted: 0,
  });

  const sections = useMemo(() => getPortalNavSections(role), [role]);

  const userCard = ROLE_CARD_META[role];

  useEffect(() => {
    const loadBadges = async () => {
      try {
        const statsPromise = tasksApi.getStats();
        const usersPromise =
          role === ROLES.MANAGER
            ? usersApi.search({
                page: 1,
                limit: 1,
              })
            : Promise.resolve(null);
        const [stats, usersRes] = await Promise.all([statsPromise, usersPromise]);
        setBadges({
          openTasks: stats.totalOpen,
          completedTasks: stats.totalCompleted,
          users: usersRes?.meta?.total ?? 0,
          tradeAssigned: stats.totalOpen,
          tradeCompleted: stats.totalCompleted,
        });
      } catch {
        setBadges({
          openTasks: 0,
          completedTasks: 0,
          users: 0,
          tradeAssigned: 0,
          tradeCompleted: 0,
        });
        appToast.error(MESSAGES.common.somethingWrong);
      }
    };
    void loadBadges();

    const onTasksChanged = () => void loadBadges();
    window.addEventListener(TASKS_CHANGED_EVENT, onTasksChanged);
    return () => window.removeEventListener(TASKS_CHANGED_EVENT, onTasksChanged);
  }, [user, role]);

  return (
    <Box
      sx={{
        width: `${STYLE_TOKENS.spacing.sidebarWidth}px`,
        flexShrink: 0,
        background: ROLE_SIDEBAR_BG[role],
        display: "flex",
        flexDirection: "column",
        borderRight: `1px solid ${STYLE_TOKENS.colors.sidebarBorder}`,
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          padding: "20px 20px 16px",
          borderBottom: `1px solid ${STYLE_TOKENS.colors.sidebarBorder}`,
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <AppLogo size={34} showWordmark />
      </Box>

      <Box
        sx={{
          padding: "14px 18px",
          borderBottom: `1px solid ${STYLE_TOKENS.colors.sidebarBorder}`,
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Box
          sx={{
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            background: userCard.avatarBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: STYLE_TOKENS.colors.white,
            fontFamily: STYLE_TOKENS.typography.fontDisplay,
            fontSize: "14px",
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {user?.initials ?? ""}
        </Box>
        <Box>
          <Typography sx={{ fontSize: "13px", fontWeight: 600, color: STYLE_TOKENS.colors.white, lineHeight: 1.1 }}>
            {user?.name ?? "User"}
          </Typography>
          <Typography sx={{ fontSize: "11px", color: STYLE_TOKENS.colors.textMuted, marginTop: "1px" }}>
            {userCard.roleLabel}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, padding: "12px 8px" }}>
        {sections.map((section) => (
          <Box key={section.id}>
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 700,
                color: role === ROLES.MANAGER ? "#9CA3AF" : "#4B5563",
                textTransform: "uppercase",
                letterSpacing: "1.2px",
                padding: "12px 12px 6px",
              }}
            >
              {section.label}
            </Typography>
            {section.items.map((item) => {
              const active = isNavActive(pathname, item.href);
              const badgeVal = item.badge !== undefined ? badges[item.badge] : undefined;
              return (
                <Box
                  key={item.href}
                  component={Link}
                  href={item.href}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderLeft: "3px solid transparent",
                    borderRadius: "8px",
                    marginBottom: "2px",
                    textDecoration: "none",
                    color: active ? STYLE_TOKENS.colors.white : "#9CA3AF",
                    fontSize: "13.5px",
                    fontWeight: 500,
                    transition: "all 0.15s",
                    background:
                      active && role === ROLES.TRADE_USER
                        ? "#166534"
                        : active
                          ? STYLE_TOKENS.colors.sidebarActive
                          : "transparent",
                    borderLeftColor:
                      active && role === ROLES.TRADE_USER ? STYLE_TOKENS.colors.green : "transparent",
                    "&:hover": {
                      background: role === ROLES.TRADE_USER ? "#1a3a25" : STYLE_TOKENS.colors.sidebarHover,
                      color: STYLE_TOKENS.colors.white,
                    },
                  }}
                >
                  <Box
                    className="nav-icon"
                    sx={{
                      fontSize: "16px",
                      width: "20px",
                      textAlign: "center",
                      flexShrink: 0,
                      color: active ? STYLE_TOKENS.colors.orange : "inherit",
                    }}
                  >
                    <AppIcon name={item.icon as AppIconProps["name"]} size={16} />
                  </Box>
                  <Box component="span" sx={{ lineHeight: 1.2 }}>
                    {item.label}
                  </Box>
                  {badgeVal !== undefined ? (
                    <Box
                      component="span"
                      className={item.badgeClass ? `nav-count ${item.badgeClass}` : "nav-count"}
                      sx={{ marginLeft: "auto", float: "none" }}
                    >
                      {badgeVal}
                    </Box>
                  ) : null}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>

      <Box sx={{ padding: "12px 8px", borderTop: `1px solid ${STYLE_TOKENS.colors.sidebarBorder}` }}>
        <AppButton
          type="button"
          onClick={() => void logout()}
          sx={{
            width: "100%",
            padding: "9px 12px",
            background: "transparent",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#9CA3AF",
            fontSize: "13px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.15s",
            justifyContent: "flex-start",
            "&:hover": {
              background: "#374151",
              color: STYLE_TOKENS.colors.white,
            },
          }}
        >
          <AppIcon name="logout" size={14} /> Logout
        </AppButton>
      </Box>
    </Box>
  );
}
