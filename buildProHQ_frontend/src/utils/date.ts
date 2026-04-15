export function formatShortDate(value: string | Date | null | undefined): string {
  if (!value) return "–";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "–";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}.${month}.${year}`;
}

const DEFAULT_LOCALE = "en-GB";

const DATE_FORMATTER = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const DATETIME_FORMATTER = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

/** Global standard: "15 Apr 2026" (safe fallback "-"). */
export function formatDate(value: string | Date | null | undefined): string {
  if (value == null || value === "") return "-";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return DATE_FORMATTER.format(d);
}

/** Global standard: "15 Apr 2026, 10:30 AM" (safe fallback "-"). */
export function formatDateTime(value: string | Date | null | undefined): string {
  if (value == null || value === "") return "-";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  // Intl may output "15 Apr 2026 at 10:30 am" in some locales; enforce comma style.
  const parts = DATETIME_FORMATTER.formatToParts(d);
  const day = parts.find((p) => p.type === "day")?.value ?? "";
  const month = parts.find((p) => p.type === "month")?.value ?? "";
  const year = parts.find((p) => p.type === "year")?.value ?? "";
  const hour = parts.find((p) => p.type === "hour")?.value ?? "";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "";
  const dayPeriod = parts.find((p) => p.type === "dayPeriod")?.value ?? "";
  const date = `${day} ${month} ${year}`.trim();
  const time = `${hour}:${minute} ${String(dayPeriod).toUpperCase()}`.trim();
  return date && time ? `${date}, ${time}` : date || "-";
}

const DEFAULT_TIME_ZONE = "Asia/Kolkata";

const INDIAN_DATE_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: DEFAULT_TIME_ZONE,
});

/**
 * Display any parsed instant in Indian long date style: "03 April 2026" (IST).
 * Missing/invalid input returns an em dash.
 */
export function formatIndianDate(value: string | Date | null | undefined): string {
  if (value == null || value === "") return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return INDIAN_DATE_FORMATTER.format(d);
}

/**
 * Table-facing helper: ISO / Date, or legacy mock "d.m.yy" strings.
 */
export function formatIndianLongDate(value: string | Date | null | undefined): string {
  if (value == null || value === "") return "—";
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^\d{1,2}\.\d{1,2}\.(\d{2}|\d{4})$/.test(trimmed)) {
      return formatIndianDateFromDotString(trimmed);
    }
  }
  return formatIndianDate(value);
}

/**
 * Calendar day in IST (not UTC midnight) to avoid off-by-one when formatting.
 */
export function formatIndianDateFromDMY(
  day: number,
  month1Based: number,
  fullYear: number,
): string {
  if (!day || !month1Based || !fullYear) return "—";
  const mm = String(month1Based).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  const d = new Date(`${fullYear}-${mm}-${dd}T12:00:00+05:30`);
  if (Number.isNaN(d.getTime())) return "—";
  return INDIAN_DATE_FORMATTER.format(d);
}

/** Parse "d.m.yy" / "dd.mm.yyyy" into Indian long date (IST). */
export function formatIndianDateFromDotString(input: string | null | undefined): string {
  if (input == null || input.trim() === "") return "—";
  const m = input.trim().match(/^(\d{1,2})\.(\d{1,2})\.(\d{2,4})$/);
  if (!m) return formatIndianDate(input);
  const day = Number(m[1]);
  const month = Number(m[2]);
  let year = Number(m[3]);
  if (year < 100) year += 2000;
  return formatIndianDateFromDMY(day, month, year);
}
