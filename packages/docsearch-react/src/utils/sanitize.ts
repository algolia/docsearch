/** Escapes HTML special characters for safe interpolation into HTML strings. */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/** Strips HTML tags and escapes the remainder for plain-text React children. */
export function sanitizeUserInput(input: string): string {
  const withoutTags = input.replace(/<[^>]*>/g, '');
  return escapeHtml(withoutTags);
}

/**
 * Returns a URL safe for href/src, or '' if unsafe.
 * Does not HTML-escape — callers building HTML strings must escape separately.
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) {
    return '';
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return '';
  }

  // Strip controls/whitespace so schemes like java\tscript: still get blocked
  let normalized = '';
  for (let i = 0; i < trimmed.length; i += 1) {
    const code = trimmed.charCodeAt(i);
    if (code > 0x20 && code !== 0x7f) {
      normalized += trimmed[i];
    }
  }
  if (!normalized) {
    return '';
  }

  if (normalized.startsWith('//')) {
    return '';
  }

  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(normalized)) {
    return trimmed;
  }

  try {
    const parsed = new URL(normalized);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:') {
      return normalized;
    }
  } catch {
    return '';
  }

  return '';
}
