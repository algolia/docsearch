export function isQueryEmpty(query?: string): boolean {
  if (!query || query.trim().length === 0) {
    return true;
  }

  return false;
}
