import DOMPurify from 'isomorphic-dompurify';

const SANITIZE_TAGS = ['p', 'br', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li'];

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
 * Matches frontend `sanitizeRichHtml` — same allowed tags / no attributes.
 */
export function sanitizeRichHtml(html: string): string {
  return DOMPurify.sanitize(html ?? '', {
    ALLOWED_TAGS: SANITIZE_TAGS,
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
}
