import type { ReactNode } from "react";

/**
 * MUI renders FormHelperText (and reserves layout) whenever `helperText` is defined,
 * including a single space. Pass through only real content so fields stay compact
 * when there is no validation message.
 */
export function compactHelperText(helperText: ReactNode | undefined): ReactNode | undefined {
  if (helperText == null) return undefined;
  if (typeof helperText === "string" && helperText.trim() === "") return undefined;
  return helperText;
}
