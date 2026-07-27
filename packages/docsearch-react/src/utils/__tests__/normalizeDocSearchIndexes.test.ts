import { describe, expect, it } from 'vitest';

import { normalizeDocSearchIndexes } from '../normalizeDocSearchIndexes';

describe('normalizeDocSearchIndexes', () => {
  it('normalizes string and configured indices in order', () => {
    expect(
      normalizeDocSearchIndexes({
        indices: [
          'docs',
          { name: 'blog', searchParameters: { facetFilters: ['type:blog'] } },
        ],
      })
    ).toEqual([
      { name: 'docs' },
      { name: 'blog', searchParameters: { facetFilters: ['type:blog'] } },
    ]);
  });

  it('requires at least one index', () => {
    expect(() => normalizeDocSearchIndexes({ indices: [] })).toThrow(
      'Must supply at least one `indices` entry for DocSearch'
    );
  });

  it('reports a configuration error when indices are missing at runtime', () => {
    expect(() => normalizeDocSearchIndexes({} as never)).toThrow(
      'Must supply at least one `indices` entry for DocSearch'
    );
  });

  it('reports a configuration error when indices are not an array at runtime', () => {
    expect(() =>
      normalizeDocSearchIndexes({ indices: 'docs' } as never)
    ).toThrow('Must supply at least one `indices` entry for DocSearch');
  });
});
