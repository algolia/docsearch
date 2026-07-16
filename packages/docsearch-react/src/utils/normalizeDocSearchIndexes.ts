import type { SearchParamsObject } from 'algoliasearch/lite';

import type { DocSearchIndex } from '../DocSearch';

export function normalizeDocSearchIndexes({
  indexName,
  indices = [],
  searchParameters,
}: {
  indexName?: string;
  indices?: Array<DocSearchIndex | string>;
  searchParameters?: SearchParamsObject;
}): DocSearchIndex[] {
  const indexes: DocSearchIndex[] = [];

  if (indexName && indexName !== '') {
    indexes.push({
      name: indexName,
      searchParameters,
    });
  }

  if (indices.length > 0) {
    indices.forEach((index) => {
      indexes.push(typeof index === 'string' ? { name: index } : index);
    });
  }

  if (indexes.length < 1) {
    throw new Error(
      'Must supply either `indexName` or `indices` for DocSearch to work'
    );
  }

  return indexes;
}
