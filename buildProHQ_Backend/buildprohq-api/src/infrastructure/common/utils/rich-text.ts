const SANITIZE_TAGS = new Set([
  'p',
  'br',
  'strong',
  'b',
  'em',
  'i',
  'ul',
  'ol',
  'li',
]);

const BASIC_ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#39;': "'",
  '&nbsp;': ' ',
};

/**
 * Matches frontend `htmlToPlainText` (buildProHQ_frontend/src/utils/richText.ts)
 * for validation parity (required / min length on meaningful text, not HTML markup).
 */
export function htmlToPlainText(html: string): string {
  if (!html) return '';
  let t = html.replace(/<[^>]+>/g, ' ');
  for (const [entity, ch] of Object.entries(BASIC_ENTITIES)) {
    t = t.split(entity).join(ch);
  }
  return t.replace(/\s+/g, ' ').trim();
}

/**
 * Same contract as frontend `sanitizeRichHtml` (DOMPurify): allowed tags only, no
 * attributes, disallowed tags stripped but their text kept (KEEP_CONTENT).
 * Implemented without `isomorphic-dompurify` so the API builds without extra native deps.
 */
export function sanitizeRichHtml(html: string): string {
  const raw = html ?? '';
  if (!raw) return '';

  let s = raw;
  s = s.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  s = s.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  return s.replace(/<\/?([a-zA-Z][a-zA-Z0-9:-]*)\b[^>]*>/g, (full, name: string) => {
    const lower = name.toLowerCase();
    if (!SANITIZE_TAGS.has(lower)) return '';
    if (full.startsWith('</')) return `</${lower}>`;
    if (lower === 'br') return '<br>';
    return `<${lower}>`;
  });
}
