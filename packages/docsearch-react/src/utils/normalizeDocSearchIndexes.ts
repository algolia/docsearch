import type { DocSearchIndex } from '../DocSearch';

export function normalizeDocSearchIndexes({
  indices,
}: {
  indices: Array<DocSearchIndex | string>;
}): DocSearchIndex[] {
  if (!Array.isArray(indices) || indices.length < 1) {
    throw new Error('Must supply at least one `indices` entry for DocSearch');
  }

  const indexes = indices.map((index) =>
    typeof index === 'string' ? { name: index } : index
  );

  return indexes;
}
