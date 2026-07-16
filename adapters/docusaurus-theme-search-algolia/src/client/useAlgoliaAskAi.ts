/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file
 * in the root directory of this source tree.
 */

import type { AskAiConfig } from '@docsearch/docusaurus-adapter';
import type {
  AgentStudioIndices,
  DocSearchAskAi,
  DocSearchProps,
} from '@docsearch/react';
import type { FacetFilters } from 'algoliasearch/lite';
import { useMemo } from 'react';

import { useAlgoliaContextualFacetFiltersIfEnabled } from './useAlgoliaContextualFacetFilters';
import { mergeFacetFilters } from './utils';

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
  return askAi.indices?.[0]?.index ?? getIndexName(indices[0]!);
}

function applyContextualSearchToAgentStudioIndex(
  index: AgentStudioIndices,
  contextualSearchFilters: FacetFilters
): AgentStudioIndices {
  return {
    ...index,
    searchParameters: {
      ...index.searchParameters,
      facetFilters: mergeFacetFilters(
        index.searchParameters?.facetFilters,
        contextualSearchFilters
      ),
    },
  };
}

// We need to apply contextualSearch facetFilters to AskAI filters
// This can't be done at config normalization time because contextual filters
// can only be determined at runtime
function applyAskAiContextualSearch(
  askAi: AskAiOptions | undefined,
  contextualSearchFilters: FacetFilters | undefined
): AskAiOptions | undefined {
  if (!askAi) {
    return undefined;
  }
  if (!contextualSearchFilters) {
    return askAi;
  }

  return {
    ...askAi,
    indices: askAi.indices?.map((index) =>
      applyContextualSearchToAgentStudioIndex(index, contextualSearchFilters)
    ),
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
