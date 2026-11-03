import { act, renderHook, waitFor } from '@testing-library/react';
import type { SearchClient } from 'algoliasearch';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { DocSearchFacet, DocSearchIndex } from '../../DocSearch';
import { useDocSearchFacets } from '../useDocSearchFacets';

describe('useDocSearchFacets', () => {
  const search = vi.fn();
  const searchClient = { search } as unknown as SearchClient;
  const indexes: DocSearchIndex[] = [{ name: 'docs' }];

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

  it('exposes only facets that have values', async () => {
    const facets: DocSearchFacet[] = [
      { key: 'language' },
      { key: 'version' },
      { key: 'empty' },
    ];

    const { result } = renderHook(() =>
      useDocSearchFacets({ facets, indexes, searchClient })
    );

    expect(result.current.visibleFacets).toEqual([]);

    await waitFor(() => {
      expect(result.current.visibleFacets).toEqual([
        { key: 'language', values: ['en', 'fr'] },
        { key: 'version', values: ['v1.0'] },
      ]);
    });
  });

  it('updates selections state, ref, and notifies on selection change', () => {
    const onSelectionsChange = vi.fn();
    const { result } = renderHook(() =>
      useDocSearchFacets({
        facets: [{ key: 'language' }],
        indexes,
        searchClient,
        onSelectionsChange,
      })
    );

    act(() => {
      result.current.handleFacetSelectionChange('language', ['en']);
    });

    expect(result.current.facetSelections).toEqual({ language: ['en'] });
    expect(result.current.facetSelectionsRef.current).toEqual({
      language: ['en'],
    });
    expect(onSelectionsChange).toHaveBeenCalledTimes(1);
  });

  it('supports multiple selected values per facet', () => {
    const onSelectionsChange = vi.fn();
    const { result } = renderHook(() =>
      useDocSearchFacets({
        facets: [{ key: 'language' }],
        indexes,
        searchClient,
        onSelectionsChange,
      })
    );

    act(() => {
      result.current.handleFacetSelectionChange('language', ['en', 'fr']);
    });

    expect(result.current.facetSelections).toEqual({ language: ['en', 'fr'] });
    expect(onSelectionsChange).toHaveBeenCalledTimes(1);
  });

  it('resolves functional updates against the current selections', () => {
    const { result } = renderHook(() =>
      useDocSearchFacets({
        facets: [{ key: 'language' }],
        indexes,
        searchClient,
      })
    );

    // Two toggles in the same act: the second must see the first's result.
    act(() => {
      result.current.handleFacetSelectionChange('language', (current) => [
        ...current,
        'en',
      ]);
      result.current.handleFacetSelectionChange('language', (current) => [
        ...current,
        'fr',
      ]);
    });

    expect(result.current.facetSelections).toEqual({ language: ['en', 'fr'] });
  });

  it('does not notify when the selected values are unchanged', () => {
    const onSelectionsChange = vi.fn();
    const { result } = renderHook(() =>
      useDocSearchFacets({
        facets: [{ key: 'language' }],
        indexes,
        searchClient,
        onSelectionsChange,
      })
    );

    act(() => {
      result.current.handleFacetSelectionChange('language', ['en', 'fr']);
    });
    act(() => {
      result.current.handleFacetSelectionChange('language', ['en', 'fr']);
    });

    expect(onSelectionsChange).toHaveBeenCalledTimes(1);
  });

  it('does not notify when clearing a facet that has no selection', () => {
    const onSelectionsChange = vi.fn();
    const { result } = renderHook(() =>
      useDocSearchFacets({
        facets: [{ key: 'language' }],
        indexes,
        searchClient,
        onSelectionsChange,
      })
    );

    act(() => {
      result.current.handleFacetSelectionChange('language', []);
    });

    expect(result.current.facetSelections).toEqual({});
    expect(onSelectionsChange).not.toHaveBeenCalled();
  });

  it('derives initial selections from configured facetFilters', () => {
    const { result } = renderHook(() =>
      useDocSearchFacets({
        facets: [{ key: 'language' }],
        indexes: [
          {
            name: 'docs',
            searchParameters: {
              facetFilters: ['language:en', ['version:v1', 'version:v2']],
            },
          },
        ],
        searchClient,
      })
    );

    expect(result.current.facetSelections).toEqual({
      language: ['en'],
      version: ['v1', 'v2'],
    });
  });

  it('updates the ref synchronously so getSources closures read fresh selections', () => {
    const { result } = renderHook(() =>
      useDocSearchFacets({
        facets: [{ key: 'language' }],
        indexes,
        searchClient,
      })
    );

    let refValueDuringChange: Record<string, string[]> | undefined;
    act(() => {
      result.current.handleFacetSelectionChange('language', ['fr']);
      refValueDuringChange = { ...result.current.facetSelectionsRef.current };
    });

    expect(refValueDuringChange).toEqual({ language: ['fr'] });
  });

  it('clears all selections and notifies', () => {
    const onSelectionsChange = vi.fn();
    const { result } = renderHook(() =>
      useDocSearchFacets({
        facets: [{ key: 'language' }],
        indexes,
        searchClient,
        onSelectionsChange,
      })
    );

    act(() => {
      result.current.handleFacetSelectionChange('language', ['en', 'fr']);
    });
    act(() => {
      result.current.clearFacetSelections();
    });

    expect(result.current.facetSelections).toEqual({ language: [] });
    expect(result.current.facetSelectionsRef.current).toEqual({ language: [] });
    expect(onSelectionsChange).toHaveBeenCalledTimes(2);
  });

  it('keeps individually cleared facets cleared when clearing all', () => {
    const onSelectionsChange = vi.fn();
    const { result } = renderHook(() =>
      useDocSearchFacets({
        facets: [{ key: 'language' }, { key: 'version' }],
        indexes: [
          {
            name: 'docs',
            searchParameters: { facetFilters: ['language:en', 'version:v1'] },
          },
        ],
        searchClient,
        onSelectionsChange,
      })
    );

    // Clear one facet, then clear all while the other still has a value.
    act(() => {
      result.current.handleFacetSelectionChange('language', []);
    });
    act(() => {
      result.current.clearFacetSelections();
    });

    // `language` must stay overridden, otherwise its configured
    // `language:en` filter would silently come back.
    expect(result.current.facetSelections).toEqual({
      language: [],
      version: [],
    });
    expect(onSelectionsChange).toHaveBeenCalledTimes(2);
  });

  it('does not notify when clearing all with no selected values', () => {
    const onSelectionsChange = vi.fn();
    const { result } = renderHook(() =>
      useDocSearchFacets({
        facets: [{ key: 'language' }],
        indexes,
        searchClient,
        onSelectionsChange,
      })
    );

    act(() => {
      result.current.handleFacetSelectionChange('language', ['en']);
    });
    act(() => {
      result.current.handleFacetSelectionChange('language', []);
    });
    act(() => {
      result.current.clearFacetSelections();
    });

    expect(result.current.facetSelections).toEqual({ language: [] });
    expect(onSelectionsChange).toHaveBeenCalledTimes(2);
  });

  it('keeps selection callbacks stable across renders', () => {
    const { result, rerender } = renderHook(
      ({ onSelectionsChange }: { onSelectionsChange: () => void }) =>
        useDocSearchFacets({
          facets: [{ key: 'language' }],
          indexes,
          searchClient,
          onSelectionsChange,
        }),
      { initialProps: { onSelectionsChange: vi.fn() } }
    );

    const firstHandleChange = result.current.handleFacetSelectionChange;
    const firstClear = result.current.clearFacetSelections;

    const latestOnSelectionsChange = vi.fn();
    rerender({ onSelectionsChange: latestOnSelectionsChange });

    expect(result.current.handleFacetSelectionChange).toBe(firstHandleChange);
    expect(result.current.clearFacetSelections).toBe(firstClear);

    // the latest callback is invoked, not the one from the first render
    act(() => {
      result.current.handleFacetSelectionChange('language', ['en']);
    });
    expect(latestOnSelectionsChange).toHaveBeenCalledTimes(1);
  });
});
