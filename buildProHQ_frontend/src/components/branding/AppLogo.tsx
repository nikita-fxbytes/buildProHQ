"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { STYLE_TOKENS } from "@/constants/style-tokens";
import { BRANDING } from "@/constants/branding";

export type AppLogoProps = {
  size?: number;
  showWordmark?: boolean;
};

export function AppLogo({ size = 34, showWordmark = true }: AppLogoProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const fallbackWordmark = useMemo(
    () => (
      <Typography
        sx={{
          fontFamily: "Rajdhani, sans-serif",
          fontSize: showWordmark ? "24px" : "18px",
          fontWeight: 700,
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ color: "#ffffff" }}>Build</span>
        <span style={{ color: STYLE_TOKENS.colors.blue }}>Pro</span>
        <span style={{ color: STYLE_TOKENS.colors.orange }}>HQ</span>
      </Typography>
    ),
    [showWordmark],
  );

  const chromeSx = showWordmark
    ? {
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "10px",
      }
    : {
        background: "transparent",
        border: "none",
        borderRadius: 0,
      };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: showWordmark ? "12px" : 0 }}>
      {!imgFailed ? (
        <Box
          sx={{
            width: size,
            height: size,
            ...chromeSx,
            overflow: "hidden",
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
          }}
        >
          <Image
            src={BRANDING.LOGO_SRC}
            alt={BRANDING.LOGO_ALT}
            width={size}
            height={size}
            priority
            onError={() => setImgFailed(true)}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </Box>
      ) : null}

      {showWordmark ? fallbackWordmark : null}
    </Box>
  );
}

