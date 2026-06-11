import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { DocSearchFacet, DocSearchIndex } from '../DocSearch';
import { useFacetValues } from '../useFacetValues';

describe('useFacetValues', () => {
  const search = vi.fn();
  const searchClient = { search } as any;

  beforeEach(() => {
    vi.clearAllMocks();
    search.mockResolvedValue({
      results: [
        {
          facets: {
            language: { en: 10, fr: 4 },
            version: { 'v1.0': 6 },
          },
        },
      ],
    });
  });

  it('fetches facet values once and merges them per facet', async () => {
    const facets: DocSearchFacet[] = [{ key: 'language' }, { key: 'version' }];
    const indexes: DocSearchIndex[] = [{ name: 'docs' }];

    const { result } = renderHook(() => useFacetValues({ facets, indexes, searchClient }));

    await waitFor(() => {
      expect(result.current).toEqual({
        language: ['en', 'fr'],
        version: ['v1.0'],
      });
    });

    expect(search).toHaveBeenCalledTimes(1);
  });

  it('does not re-fetch when facet/index props are recreated with identical content', async () => {
    const { result, rerender } = renderHook(
      ({ facets, indexes }: { facets: DocSearchFacet[]; indexes: DocSearchIndex[] }) =>
        useFacetValues({ facets, indexes, searchClient }),
      {
        initialProps: {
          facets: [{ key: 'language' }] as DocSearchFacet[],
          indexes: [{ name: 'docs' }] as DocSearchIndex[],
        },
      },
    );

    await waitFor(() => {
      expect(result.current.language).toBeDefined();
    });

    // New array/object identities but identical content (mirrors the
    // per-render prop recreation that previously caused an infinite loop).
    rerender({ facets: [{ key: 'language' }], indexes: [{ name: 'docs' }] });
    rerender({ facets: [{ key: 'language' }], indexes: [{ name: 'docs' }] });

    expect(search).toHaveBeenCalledTimes(1);
  });

  it('does not search when there are no facets', () => {
    const { result } = renderHook(() => useFacetValues({ facets: [], indexes: [{ name: 'docs' }], searchClient }));

    expect(result.current).toEqual({});
    expect(search).not.toHaveBeenCalled();
  });
});
