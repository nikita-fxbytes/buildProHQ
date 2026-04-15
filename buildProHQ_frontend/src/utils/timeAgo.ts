import { formatDateTime } from "@/utils/date";

export function timeAgo(input: string | Date | null | undefined): { label: string; title: string } {
  if (!input) return { label: "—", title: "" };
  const d = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return { label: "—", title: "" };

  const diffMs = d.getTime() - Date.now();
  const abs = Math.abs(diffMs);
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  const min = 60 * 1000;
  const hour = 60 * min;
  const day = 24 * hour;

  let value: number;
  let unit: Intl.RelativeTimeFormatUnit;
  if (abs < hour) {
    value = Math.round(diffMs / min);
    unit = "minute";
  } else if (abs < day) {
    value = Math.round(diffMs / hour);
    unit = "hour";
  } else {
    value = Math.round(diffMs / day);
    unit = "day";
  }

  return { label: rtf.format(value, unit), title: formatDateTime(d) };
}

