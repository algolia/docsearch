/**
 * Escapes HTML special characters to prevent XSS attacks.
 * This should be used for any user-provided content that will be displayed.
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
 */
export function sanitizeUserInput(input: string): string {
  // First, remove any HTML tags
  const withoutTags = input.replace(/<[^>]*>/g, '');
  // Then escape any remaining special characters
  return escapeHtml(withoutTags);
}
