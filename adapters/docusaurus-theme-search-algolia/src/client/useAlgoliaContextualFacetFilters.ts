/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { useDocsContextualSearchTags } from '@docusaurus/plugin-content-docs/client';
import { DEFAULT_SEARCH_TAG } from '@docusaurus/theme-common/internal';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import type { FacetFilters } from 'algoliasearch/lite';

import { useAlgoliaThemeConfig } from './useAlgoliaThemeConfig';

function useSearchTags() {
  try {
    // only docs have custom search tags per version
    const docsTags = useDocsContextualSearchTags();
    return [DEFAULT_SEARCH_TAG, ...docsTags];
  } catch (error) {
    // In monorepo setups, duplicated docs plugin instances can cause
    // React context lookup to fail during SSG/runtime. Disable contextual
    // filters in that case instead of crashing or over-filtering results.
    if (error instanceof Error && error.name === 'ReactContextError') {
      return undefined;
    }
    throw error;
  }
}

// Translate search-engine agnostic search tags to Algolia search filters
export function useAlgoliaContextualFacetFilters(): FacetFilters {
  const locale = useDocusaurusContext().i18n.currentLocale;
  const tags = useSearchTags();

  if (!tags) {
    return [];
  }

  // Seems safe to convert locale->language, see AlgoliaSearchMetadata comment
  const languageFilter = `language:${locale}`;

  const tagsFilter = tags.map((tag) => `docusaurus_tag:${tag}`);

  return [languageFilter, tagsFilter];
}

export function useAlgoliaContextualFacetFiltersIfEnabled(): FacetFilters | undefined {
  const { contextualSearch } = useAlgoliaThemeConfig();
  const facetFilters = useAlgoliaContextualFacetFilters();
  if (contextualSearch) {
    return facetFilters;
  }

  return undefined;
}
