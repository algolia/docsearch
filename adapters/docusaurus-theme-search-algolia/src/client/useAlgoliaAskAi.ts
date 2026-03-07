/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type { AskAiConfig } from '@docsearch/docusaurus-adapter';
import type { DocSearchModalProps, DocSearchTranslations } from '@docsearch/react';
import translations from '@theme/SearchTranslations';
import type { FacetFilters } from 'algoliasearch/lite';
import { useCallback, useMemo, useState } from 'react';

import { useAlgoliaContextualFacetFiltersIfEnabled } from './useAlgoliaContextualFacetFilters';
import { mergeFacetFilters } from './utils';

// The minimal props the hook needs from DocSearch
interface DocSearchPropsLite {
  indexName: string;
  apiKey: string;
  appId: string;
  placeholder?: string;
  translations?: DocSearchTranslations;
  searchParameters?: DocSearchModalProps['searchParameters'];
  askAi?: AskAiConfig;
}

type OnAskAiToggle = NonNullable<DocSearchModalProps['onAskAiToggle']>;
type AskAiConfigWithoutSidePanel = Omit<AskAiConfig, 'sidePanel'>;
type DocSearchAskAi = Exclude<DocSearchModalProps['askAi'], string | undefined>;
type DocSearchModalPropsLite = Partial<Omit<DocSearchModalProps, 'askAi'>>;

type UseAskAiResult = {
  canHandleAskAi: boolean;
  isAskAiActive: boolean;
  currentPlaceholder: string | undefined;
  onAskAiToggle: OnAskAiToggle;
  askAi?: AskAiConfig;
  extraAskAiProps: DocSearchModalPropsLite & {
    askAi?: DocSearchAskAi;
    canHandleAskAi?: boolean;
    isAskAiActive?: boolean;
    onAskAiToggle?: OnAskAiToggle;
  };
};

// We need to apply contextualSearch facetFilters to AskAI filters
// This can't be done at config normalization time because contextual filters
// can only be determined at runtime
function applyAskAiContextualSearch(
  askAi: AskAiConfig | undefined,
  contextualSearchFilters: FacetFilters | undefined,
): AskAiConfig | undefined {
  if (!askAi) {
    return undefined;
  }
  if (askAi.agentStudio === true) {
    return askAi;
  }
  if (!contextualSearchFilters) {
    return askAi;
  }
  const askAiFacetFilters = askAi.searchParameters?.facetFilters;
  return {
    ...askAi,
    searchParameters: {
      ...askAi.searchParameters,
      facetFilters: mergeFacetFilters(askAiFacetFilters, contextualSearchFilters),
    },
  };
}

export function useAlgoliaAskAi(props: DocSearchPropsLite): UseAskAiResult {
  const [isAskAiActive, setIsAskAiActive] = useState(false);
  const contextualSearchFilters = useAlgoliaContextualFacetFiltersIfEnabled();

  const askAi = useMemo(() => {
    return applyAskAiContextualSearch(props.askAi, contextualSearchFilters);
  }, [props.askAi, contextualSearchFilters]);

  const askAiWithoutSidePanel = useMemo<AskAiConfigWithoutSidePanel | undefined>(() => {
    if (!askAi) {
      return undefined;
    }
    const { sidePanel: _sidePanel, ...docsearchAskAi } = askAi;
    return docsearchAskAi;
  }, [askAi]);

  const modalAskAi = useMemo<DocSearchAskAi | undefined>(() => {
    if (!askAiWithoutSidePanel) {
      return undefined;
    }
    return askAiWithoutSidePanel as DocSearchAskAi;
  }, [askAiWithoutSidePanel]);

  const canHandleAskAi = Boolean(askAi);

  const currentPlaceholder = isAskAiActive
    ? translations.modal?.searchBox?.placeholderTextAskAi
    : translations.modal?.searchBox?.placeholderText || props?.placeholder;

  const onAskAiToggle = useCallback<OnAskAiToggle>((askAiToggle: boolean) => {
    setIsAskAiActive(askAiToggle);
  }, []);

  const extraAskAiProps: UseAskAiResult['extraAskAiProps'] = {
    askAi: modalAskAi,
    canHandleAskAi,
    isAskAiActive,
    onAskAiToggle,
  };

  return {
    canHandleAskAi,
    isAskAiActive,
    currentPlaceholder,
    onAskAiToggle,
    askAi,
    extraAskAiProps,
  };
}
