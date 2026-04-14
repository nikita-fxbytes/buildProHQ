"use client";

import { STYLE_TOKENS } from "@/constants/style-tokens";

export function mgmtAccent(tone: "orange" | "blue" | "green" | "red") {
  if (tone === "orange") return STYLE_TOKENS.colors.orange;
  if (tone === "blue") return STYLE_TOKENS.colors.blue;
  if (tone === "green") return STYLE_TOKENS.colors.green;
  return STYLE_TOKENS.colors.red;
}

