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

function decodeUrlForSchemeCheck(value: string): string {
  let current = value;
  for (let i = 0; i < 3; i += 1) {
    try {
      const decoded = decodeURIComponent(current);
      if (decoded === current) {
        break;
      }
      current = decoded;
    } catch {
      break;
    }
  }
  return current;
}

function stripControlsAndWhitespace(value: string): string {
  let result = '';
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code > 0x20 && code !== 0x7f) {
      result += value[i];
    }
  }
  return result;
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

  const normalized = stripControlsAndWhitespace(decodeUrlForSchemeCheck(trimmed));
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
