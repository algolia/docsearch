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

  // Browsers may ignore ASCII whitespace/controls inside schemes (e.g. java\tscript:)
  let normalized = '';
  for (let i = 0; i < trimmed.length; i += 1) {
    const code = trimmed.charCodeAt(i);
    // Keep characters outside ASCII controls (0x00-0x1F), space (0x20), and DEL (0x7F)
    if (code > 0x20 && code !== 0x7f) {
      normalized += trimmed[i];
    }
  }
  if (!normalized) {
    return '';
  }

  // Protocol-relative URLs can be used for XSS in some contexts
  if (normalized.startsWith('//')) {
    return '';
  }

  // No scheme → treat as relative / fragment / query
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
