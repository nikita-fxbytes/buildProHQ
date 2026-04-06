export function formatShortDate(value: string | Date | null | undefined): string {
  if (!value) return "–";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "–";

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}.${month}.${year}`;
}

