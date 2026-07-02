/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { SearchPageFacetConfig } from './types';

export const HITS_PER_PAGE = 15;

// `content:<words>` snippet, keeps result cards scannable
export const SNIPPET_ATTRIBUTES = ['content:30'];
export const SNIPPET_ELLIPSIS_TEXT = '…';

export const SEARCH_DEBOUNCE_MS = 300;

export const RECENT_SEARCHES_KEY = 'docsearch:search-page:recent';
export const RECENT_SEARCHES_LIMIT = 6;

// Facets rendered in the sidebar when the user doesn't configure their own.
// `hierarchy.lvl0` is the top-level documentation section, which is the most
// useful, least noisy facet for a docs search page.
export const DEFAULT_FACETS: SearchPageFacetConfig[] = [{ attribute: 'hierarchy.lvl0', label: 'Section' }];

export const FACET_VALUES_LIMIT = 12;

// Number of "Browse by section" chips shown on the empty state.
export const TOP_SECTIONS_LIMIT = 8;
export const TOP_SECTIONS_FACET = 'hierarchy.lvl0';

export const FACET_SORT_BY = ['isRefined:desc', 'count:desc', 'name:asc'];
