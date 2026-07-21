/**
 * Escapes HTML special characters to prevent XSS attacks.
 * Use when interpolating into an HTML string. Prefer React text children when possible.
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitizes user input to prevent XSS attacks.
 * Removes any HTML tags and escapes special characters.
 * Use for plain-text React children (not HTML attributes or markdown HTML).
 */
export function sanitizeUserInput(input: string): string {
  // First, remove any HTML tags
  const withoutTags = input.replace(/<[^>]*>/g, '');
  // Then escape any remaining special characters
  return escapeHtml(withoutTags);
}

/**
 * Returns a URL safe for href/src, or an empty string if the scheme is unsafe.
 * Does not HTML-escape — escape separately when building HTML strings; React attrs need the raw value.
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) {
    return '';
  }

  const trimmed = url.trim();
  if (!trimmed) {
    return '';
  }

  // Protocol-relative URLs can be used for XSS in some contexts
  if (trimmed.startsWith('//')) {
    return '';
  }

  // No scheme → treat as relative / fragment / query
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:' || parsed.protocol === 'mailto:') {
      return trimmed;
    }
  } catch {
    return '';
  }

  return '';
}
