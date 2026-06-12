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
    const facets: DocSearchFacet[] = [{ key: 'language' }, { key: 'version' }, { key: 'empty' }];

    const { result } = renderHook(() => useDocSearchFacets({ facets, indexes, searchClient }));

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
      }),
    );

    act(() => {
      result.current.handleFacetSelectionChange('language', 'en');
    });

    expect(result.current.facetSelections).toEqual({ language: 'en' });
    expect(result.current.facetSelectionsRef.current).toEqual({
      language: 'en',
    });
    expect(onSelectionsChange).toHaveBeenCalledTimes(1);
  });

  it('updates the ref synchronously so getSources closures read fresh selections', () => {
    const { result } = renderHook(() =>
      useDocSearchFacets({
        facets: [{ key: 'language' }],
        indexes,
        searchClient,
      }),
    );

    let refValueDuringChange: Record<string, string> | undefined;
    act(() => {
      result.current.handleFacetSelectionChange('language', 'fr');
      refValueDuringChange = { ...result.current.facetSelectionsRef.current };
    });

    expect(refValueDuringChange).toEqual({ language: 'fr' });
  });

  it('clears all selections and notifies', () => {
    const onSelectionsChange = vi.fn();
    const { result } = renderHook(() =>
      useDocSearchFacets({
        facets: [{ key: 'language' }],
        indexes,
        searchClient,
        onSelectionsChange,
      }),
    );

    act(() => {
      result.current.handleFacetSelectionChange('language', 'en');
    });
    act(() => {
      result.current.clearFacetSelections();
    });

    expect(result.current.facetSelections).toEqual({});
    expect(result.current.facetSelectionsRef.current).toEqual({});
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
      { initialProps: { onSelectionsChange: vi.fn() } },
    );

    const firstHandleChange = result.current.handleFacetSelectionChange;
    const firstClear = result.current.clearFacetSelections;

    const latestOnSelectionsChange = vi.fn();
    rerender({ onSelectionsChange: latestOnSelectionsChange });

    expect(result.current.handleFacetSelectionChange).toBe(firstHandleChange);
    expect(result.current.clearFacetSelections).toBe(firstClear);

    // the latest callback is invoked, not the one from the first render
    act(() => {
      result.current.handleFacetSelectionChange('language', 'en');
    });
    expect(latestOnSelectionsChange).toHaveBeenCalledTimes(1);
  });
});
