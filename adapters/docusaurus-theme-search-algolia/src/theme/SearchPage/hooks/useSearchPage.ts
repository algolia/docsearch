/* eslint-disable import/dynamic-import-chunkname */
/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file
 * in the root directory of this source tree.
 */

import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { useHistory } from '@docusaurus/router';
import {
  useEvent,
  useHistorySelector,
  useSearchQueryString,
} from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type algoliaSearchHelper from 'algoliasearch-helper';
import createAlgoliaSearchHelper from 'algoliasearch-helper';
import { liteClient } from 'algoliasearch/lite';
import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import type { InsightsClient } from 'search-insights';

import {
  useAlgoliaThemeConfig,
  useSearchResultUrlProcessor,
} from '../../../client';
import {
  DEFAULT_FACETS,
  FACET_SORT_BY,
  FACET_VALUES_LIMIT,
  HITS_PER_PAGE,
  SEARCH_DEBOUNCE_MS,
  SNIPPET_ATTRIBUTES,
  SNIPPET_ELLIPSIS_TEXT,
  TOP_SECTIONS_FACET,
} from '../constants';
import type {
  FacetGroup,
  FacetValueItem,
  Refinements,
  SearchPageFacetConfig,
  SearchResultItem,
} from '../types';
import { getIndexName, getIndexSearchParameters } from '../utils';

import {
  useDocsSearchVersions,
  type DocsSearchVersionsHelpers,
} from './useDocsSearchVersions';

type AlgoliaDocHit = {
  objectID: string;
  url: string;
  type?: string;
  _highlightResult?: { hierarchy?: { [key: string]: { value: string } } };
  _snippetResult?: { content?: { value: string } };
};

type SearchResultUpdate = {
  items: SearchResultItem[];
  query: string;
  queryID: string | undefined;
  totalResults: number;
  totalPages: number;
  lastPage: number;
  hasMore: boolean;
  facets: FacetGroup[];
};

type SearchState = {
  items: SearchResultItem[];
  query: string | null;
  queryID: string | undefined;
  totalResults: number | null;
  totalPages: number | null;
  lastPage: number | null;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: boolean;
  facets: FacetGroup[];
};

type SearchAction =
  | { type: 'advance' }
  | { type: 'error' }
  | { type: 'loading' }
  | { type: 'reset' }
  | { type: 'update'; value: SearchResultUpdate };

const initialSearchState: SearchState = {
  items: [],
  query: null,
  queryID: undefined,
  totalResults: null,
  totalPages: null,
  lastPage: null,
  hasMore: false,
  loading: false,
  loadingMore: false,
  error: false,
  facets: [],
};

function searchReducer(
  prevState: SearchState,
  action: SearchAction
): SearchState {
  switch (action.type) {
    case 'reset': {
      return initialSearchState;
    }
    case 'loading': {
      return { ...prevState, loading: true, error: false };
    }
    case 'error': {
      return { ...prevState, loading: false, loadingMore: false, error: true };
    }
    case 'advance': {
      const hasMore =
        (prevState.totalPages ?? 0) > (prevState.lastPage ?? 0) + 1;
      return {
        ...prevState,
        lastPage: hasMore ? (prevState.lastPage ?? 0) + 1 : prevState.lastPage,
        hasMore,
        loadingMore: hasMore,
      };
    }
    case 'update': {
      const { value } = action;
      return {
        ...prevState,
        items:
          value.lastPage === 0
            ? value.items
            : prevState.items.concat(value.items),
        query: value.query,
        queryID: value.queryID,
        totalResults: value.totalResults,
        totalPages: value.totalPages,
        lastPage: value.lastPage,
        hasMore: value.hasMore,
        facets: value.facets,
        loading: false,
        loadingMore: false,
        error: false,
      };
    }
    default: {
      const exhaustiveCheck: never = action;
      return exhaustiveCheck;
    }
  }
}

// DocSearch-scraped records use a legacy highlight tag. Map it onto a class we
// can style on the search page.
function sanitizeHighlight(value: string): string {
  return value.replace(
    /algolia-docsearch-suggestion--highlight/g,
    'search-result-match'
  );
}

function mapHitToResultItem(
  hit: AlgoliaDocHit,
  processUrl: (url: string) => string
): SearchResultItem {
  const hierarchy = hit._highlightResult?.hierarchy ?? {};
  const titles = Object.keys(hierarchy).map((key) =>
    sanitizeHighlight(hierarchy[key]!.value)
  );
  const snippet = hit._snippetResult?.content?.value;

  return {
    objectID: hit.objectID,
    title: titles.pop() ?? '',
    url: processUrl(hit.url),
    summary: snippet ? sanitizeHighlight(snippet) : '',
    breadcrumbs: titles,
    type: hit.type ?? '',
  };
}

function toFacetValues(
  raw: ReturnType<algoliaSearchHelper.SearchResults['getFacetValues']>
): FacetValueItem[] {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw.slice(0, FACET_VALUES_LIMIT).map((value) => ({
    name: value.name,
    count: value.count,
    isRefined: value.isRefined,
  }));
}

export type UseSearchPage = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  items: SearchResultItem[];
  totalResults: number | null;
  loading: boolean;
  loadingMore: boolean;
  error: boolean;
  hasMore: boolean;
  facets: FacetGroup[];
  refinements: Refinements;
  toggleRefinement: (attribute: string, value: string) => void;
  clearRefinements: () => void;
  hasActiveRefinements: boolean;
  loadMore: () => void;
  sendResultClick: (item: SearchResultItem, position: number) => void;
  versionHelpers: DocsSearchVersionsHelpers;
};

export function useSearchPage(): UseSearchPage {
  const {
    i18n: { currentLocale },
  } = useDocusaurusContext();
  const { appId, apiKey, indices, contextualSearch, insights, searchPage } =
    useAlgoliaThemeConfig();
  const insightsEnabled = Boolean(insights);

  const searchIndex = indices[0]!;
  const indexName = getIndexName(searchIndex);
  const indexSearchParameters = useMemo(
    () => getIndexSearchParameters(searchIndex),
    [searchIndex]
  );
  const processSearchResultUrl = useSearchResultUrlProcessor();

  const facetConfig = useMemo<SearchPageFacetConfig[]>(() => {
    const configured = searchPage === false ? undefined : searchPage.facets;
    return configured && configured.length > 0 ? configured : DEFAULT_FACETS;
  }, [searchPage]);
  const facetAttributes = useMemo(
    () => facetConfig.map((facet) => facet.attribute),
    [facetConfig]
  );
  // Attributes we can refine on via the URL. Always include the "browse by
  // section" facet so empty-state section chips work even if the user
  // customized `facets`.
  const refinableAttributes = useMemo(
    () => Array.from(new Set([...facetAttributes, TOP_SECTIONS_FACET])),
    [facetAttributes]
  );

  const versionHelpers = useDocsSearchVersions();
  const [searchQuery, setSearchQuery] = useSearchQueryString();

  // Facet refinements live in the URL so filtered searches are shareable and
  // work with browser back/forward.
  const history = useHistory();
  const refinementsJson = useHistorySelector((historyState) => {
    const params = new URLSearchParams(historyState.location.search);
    const result: Refinements = {};
    refinableAttributes.forEach((attribute) => {
      const values = params.getAll(attribute);
      if (values.length > 0) {
        result[attribute] = values;
      }
    });
    return JSON.stringify(result);
  });
  const refinements = useMemo(
    () => JSON.parse(refinementsJson) as Refinements,
    [refinementsJson]
  );
  const hasActiveRefinements = Object.keys(refinements).length > 0;

  const setAttributeValues = useEvent((attribute: string, values: string[]) => {
    const params = new URLSearchParams(history.location.search);
    params.delete(attribute);
    values.forEach((value) => params.append(attribute, value));
    history.replace({ search: params.toString() });
  });

  const toggleRefinement = useEvent((attribute: string, value: string) => {
    const current = refinements[attribute] ?? [];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    setAttributeValues(attribute, next);
  });

  const clearRefinements = useEvent(() => {
    const params = new URLSearchParams(history.location.search);
    refinableAttributes.forEach((attribute) => params.delete(attribute));
    history.replace({ search: params.toString() });
  });

  const [state, dispatch] = useReducer(searchReducer, initialSearchState);

  // Create the Algolia client + helper once, rather than on every render.
  const helper = useMemo(() => {
    const client = liteClient(appId, apiKey);
    const disjunctiveFacets = Array.from(
      new Set([
        ...(contextualSearch ? ['language', 'docusaurus_tag'] : []),
        ...refinableAttributes,
      ])
    );

    return createAlgoliaSearchHelper(client, indexName, {
      ...indexSearchParameters,
      hitsPerPage: HITS_PER_PAGE,
      advancedSyntax: true,
      attributesToSnippet: SNIPPET_ATTRIBUTES,
      snippetEllipsisText: SNIPPET_ELLIPSIS_TEXT,
      disjunctiveFacets,
      ...(insightsEnabled ? { clickAnalytics: true } : {}),
    });
  }, [
    appId,
    apiKey,
    indexName,
    contextualSearch,
    insightsEnabled,
    indexSearchParameters,
    refinableAttributes,
  ]);

  useEffect(() => {
    const handleResult = ({
      results,
    }: {
      results: algoliaSearchHelper.SearchResults;
    }): void => {
      const { query, hits, page, nbHits, nbPages, queryID } = results;

      // Ignore stale responses for a previous query.
      if (query !== searchQuery) {
        return;
      }

      // An empty query with active refinements is a valid "browse by facet"
      // search; only reset when there is genuinely nothing to search.
      if (!Array.isArray(hits) || (query === '' && !hasActiveRefinements)) {
        dispatch({ type: 'reset' });
        return;
      }

      const items = (hits as AlgoliaDocHit[]).map((hit) =>
        mapHitToResultItem(hit, processSearchResultUrl)
      );
      const facets = facetConfig
        .map((facet) => ({
          attribute: facet.attribute,
          label: facet.label ?? facet.attribute,
          items: toFacetValues(
            results.getFacetValues(facet.attribute, { sortBy: FACET_SORT_BY })
          ),
        }))
        .filter((group) => group.items.length > 0);

      dispatch({
        type: 'update',
        value: {
          items,
          query,
          queryID,
          totalResults: nbHits,
          totalPages: nbPages,
          lastPage: page,
          hasMore: nbPages > page + 1,
          facets,
        },
      });
    };

    const handleError = (): void => {
      dispatch({ type: 'error' });
    };

    helper.on('result', handleResult);
    helper.on('error', handleError);

    return () => {
      helper.removeListener('result', handleResult);
      helper.removeListener('error', handleError);
    };
  }, [
    helper,
    searchQuery,
    hasActiveRefinements,
    facetConfig,
    processSearchResultUrl,
  ]);

  const makeSearch = useEvent((page: number = 0) => {
    // Rebuild refinements from scratch each search, since the helper is stable.
    helper.clearRefinements();

    if (contextualSearch) {
      helper.addDisjunctiveFacetRefinement('docusaurus_tag', 'default');
      helper.addDisjunctiveFacetRefinement('language', currentLocale);

      Object.entries(versionHelpers.searchVersions).forEach(
        ([pluginId, searchVersion]) => {
          helper.addDisjunctiveFacetRefinement(
            'docusaurus_tag',
            `docs-${pluginId}-${searchVersion}`
          );
        }
      );
    }

    Object.entries(refinements).forEach(([attribute, values]) => {
      values.forEach((value) =>
        helper.addDisjunctiveFacetRefinement(attribute, value)
      );
    });

    helper.setQuery(searchQuery).setPage(page).search();
  });

  useEffect(() => {
    dispatch({ type: 'reset' });

    // Search when there is a query, or when browsing by facet with no query.
    if (!searchQuery && !hasActiveRefinements) {
      return undefined;
    }

    dispatch({ type: 'loading' });

    const searchTimeoutId = setTimeout(() => {
      makeSearch();
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(searchTimeoutId);
    };
  }, [
    searchQuery,
    hasActiveRefinements,
    refinements,
    versionHelpers.searchVersions,
    makeSearch,
  ]);

  useEffect(() => {
    if (!state.lastPage || state.lastPage === 0) {
      return;
    }

    makeSearch(state.lastPage);
  }, [makeSearch, state.lastPage]);

  const loadMore = useCallback(() => {
    dispatch({ type: 'advance' });
  }, []);

  // Lazily load Algolia Insights only when analytics is enabled, mirroring the
  // DocSearch modal (which also gates click analytics behind `insights`).
  const insightsRef = useRef<InsightsClient | null>(null);
  useEffect(() => {
    if (!insightsEnabled || !ExecutionEnvironment.canUseDOM) {
      return undefined;
    }

    let cancelled = false;
    import('search-insights')
      .then(({ default: aa }) => {
        if (cancelled) {
          return;
        }
        aa('init', { appId, apiKey });
        insightsRef.current = aa;
      })
      .catch(() => {
        // Analytics is a non-critical enhancement; ignore load failures.
      });

    return () => {
      cancelled = true;
    };
  }, [insightsEnabled, appId, apiKey]);

  const sendResultClick = useEvent(
    (item: SearchResultItem, position: number) => {
      const aa = insightsRef.current;
      if (!insightsEnabled || !aa || !state.queryID) {
        return;
      }

      aa('clickedObjectIDsAfterSearch', {
        eventName: 'Item Selected',
        index: indexName,
        queryID: state.queryID,
        objectIDs: [item.objectID],
        positions: [position],
      });
    }
  );

  return {
    searchQuery,
    setSearchQuery,
    items: state.items,
    totalResults: state.totalResults,
    loading: state.loading,
    loadingMore: state.loadingMore,
    error: state.error,
    hasMore: state.hasMore,
    facets: state.facets,
    refinements,
    toggleRefinement,
    clearRefinements,
    hasActiveRefinements,
    loadMore,
    sendResultClick,
    versionHelpers,
  };
}
