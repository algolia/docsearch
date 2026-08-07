/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file
 * in the root directory of this source tree.
 */

import type { AskAiConfig } from '@docsearch/docusaurus-adapter';
import type { DocSearchAskAi, DocSearchProps } from '@docsearch/react';
import type { FacetFilters } from 'algoliasearch/lite';
import { useMemo } from 'react';

import { useAlgoliaContextualFacetFiltersIfEnabled } from './useAlgoliaContextualFacetFilters';

type AskAiOptions = AskAiConfig & Pick<DocSearchAskAi, 'tools'>;
// The minimal props the hook needs from DocSearch
interface DocSearchPropsLite {
  apiKey: string;
  appId: string;
  indices: NonNullable<DocSearchProps['indices']>;
  askAi?: AskAiOptions;
}

type UseAskAiResult = {
  modalAskAi?: DocSearchAskAi;
  sidePanelAskAi?: DocSearchAskAi & {
    apiKey: string;
    appId: string;
    indexName: string;
  };
};

function getIndexName(
  index: NonNullable<DocSearchProps['indices']>[number]
): string {
  return typeof index === 'string' ? index : index.name;
}

function getAskAiIndexName(
  askAi: AskAiConfig,
  indices: NonNullable<DocSearchProps['indices']>
): string {
  return askAi.indices?.[0] ?? getIndexName(indices[0]!);
}

function facetFiltersToFilterString(facetFilters: FacetFilters): string {
  const items = Array.isArray(facetFilters) ? facetFilters : [facetFilters];

  return items
    .map((item) =>
      Array.isArray(item) ? `(${item.join(' OR ')})` : String(item)
    )
    .join(' AND ');
}

function mergeFilters(existing: string | undefined, added: string): string {
  return existing ? `(${existing}) AND (${added})` : added;
}

// We need to apply contextualSearch facetFilters to AskAI filters
// This can't be done at config normalization time because contextual filters
// can only be determined at runtime. Agent Studio accepts them via
// askAi.searchParameters[index].filters, keyed by dynamic index names.
function applyAskAiContextualSearch(
  askAi: AskAiOptions | undefined,
  contextualSearchFilters: FacetFilters | undefined
): AskAiOptions | undefined {
  if (!askAi || !contextualSearchFilters || !askAi.indices?.length) {
    return askAi;
  }

  const contextualFilters = facetFiltersToFilterString(contextualSearchFilters);
  const searchParameters = { ...askAi.searchParameters };

  for (const indexName of askAi.indices) {
    const current = searchParameters[indexName] ?? {};
    searchParameters[indexName] = {
      ...current,
      filters: mergeFilters(current.filters, contextualFilters),
    };
  }

  return {
    ...askAi,
    searchParameters,
  };
}

export function useAlgoliaAskAi(props: DocSearchPropsLite): UseAskAiResult {
  const contextualSearchFilters = useAlgoliaContextualFacetFiltersIfEnabled();

  const askAi = useMemo(() => {
    return applyAskAiContextualSearch(props.askAi, contextualSearchFilters);
  }, [props.askAi, contextualSearchFilters]);

  const resolvedAskAi = useMemo<UseAskAiResult['sidePanelAskAi']>(() => {
    if (!askAi) {
      return undefined;
    }
    return {
      ...askAi,
      apiKey: props.apiKey,
      appId: props.appId,
      indexName: getAskAiIndexName(askAi, props.indices),
    };
  }, [askAi, props.apiKey, props.appId, props.indices]);

  return {
    modalAskAi: resolvedAskAi,
    sidePanelAskAi: resolvedAskAi,
  };
}
