import DOMPurify from "isomorphic-dompurify";

const SANITIZE_TAGS = ["p", "br", "strong", "b", "em", "i", "ul", "ol", "li"];

const BASIC_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&nbsp;": " ",
};

/** Escape plain text before inserting into HTML paragraphs. */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Strip tags to plain text for validation, search, and table cells (no HTML rendering in lists). */
export function htmlToPlainText(html: string): string {
  if (!html) return "";
  let t = html.replace(/<[^>]+>/g, " ");
  for (const [entity, ch] of Object.entries(BASIC_ENTITIES)) {
    t = t.split(entity).join(ch);
  }
  return t.replace(/\s+/g, " ").trim();
}

/** Plain-text preview for confirm dialogs (handles stored HTML or legacy plain strings). */
export function truncateRichPlainText(html: string, maxLen: number): string {
  const plain = htmlToPlainText(html);
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen)}...`;
}

/** Sanitize editor HTML before sending to API or persisting. */
export function sanitizeRichHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: SANITIZE_TAGS,
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
}

/** Append voice/paste plain text as new paragraph(s) to existing HTML. */
export function appendPlainTextToRichHtml(html: string, plain: string): string {
  const trimmed = plain.trim();
  if (!trimmed) return html || "";
  const parts = trimmed.split(/\n+/).map((line) => escapeHtml(line) || "<br />");
  const block = parts.map((line) => `<p>${line}</p>`).join("");
  if (!html?.trim() || htmlToPlainText(html).length === 0) return block;
  return `${html}${block}`;
}
