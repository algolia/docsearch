const segmentsCache = new Map<string, string[]>();

function parseKey(key: string): string[] {
  const cachedKey = segmentsCache.get(key);
  if (cachedKey) return cachedKey;

  // Parses the key for array indexing and transforms to `.` delimited
  const segments = key
    .replace(/\[(\w+)\]/g, '.$1')
    .replace(/^\/./, '')
    .split('.');

  segmentsCache.set(key, segments);

  return segments;
}

export function getNestedValue(obj: unknown, key: string): unknown {
  const segments = parseKey(key);

  return segments.reduce<unknown>((acc, curr) => {
    if (
      acc &&
      typeof acc === 'object' &&
      Object.prototype.hasOwnProperty.call(acc, curr)
    ) {
      return (acc as Record<string, unknown>)[curr];
    }

    return undefined;
  }, obj);
}
