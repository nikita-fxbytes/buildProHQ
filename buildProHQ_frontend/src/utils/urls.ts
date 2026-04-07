import { APP } from "@/constants/app";

export function resolvePublicUrl(input: string): string {
  const v = (input ?? "").trim();
  if (!v) return "";
  if (/^(blob:|data:)/i.test(v)) return v;
  if (/^https?:\/\//i.test(v)) return v;
  try {
    // Works for "/uploads/x.jpg" and "uploads/x.jpg"
    return new URL(v, APP.BASE_URL).toString();
  } catch {
    return v;
  }
}

