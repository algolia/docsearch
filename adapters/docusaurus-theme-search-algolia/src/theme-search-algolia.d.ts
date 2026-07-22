/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file
 * in the root directory of this source tree.
 */

declare module '@docsearch/docusaurus-adapter' {
  import type {
    AgentStudioIndices,
    AgentStudioSearchParameters,
    DocSearchAskAi,
    DocSearchProps,
    ToolCalls,
  } from '@docsearch/react';
  import type { SidepanelProps } from '@docsearch/react/sidepanel';

  type DocusaurusSidePanelConfig =
    | boolean
    | (Omit<SidepanelProps, 'tools'> & { hideButton?: boolean });
  type DocusaurusSearchBarSidePanelProps =
    | boolean
    | (Omit<SidepanelProps, 'tools'> & {
        hideButton?: boolean;
        tools?: ToolCalls;
      });

  type SearchPageFacetConfig = {
    /**
     * Algolia attribute to build a refinement list from (e.g.
     * `hierarchy.lvl0`).
     */
    attribute: string;
    /** Human-readable label displayed above the refinement list. */
    label?: string;
  };

  type SearchPageConfig =
    | false
    | {
        path?: string;
        /**
         * Facets exposed as refinement lists in the search page sidebar.
         * Defaults to a single "Section" facet built from `hierarchy.lvl0`.
         */
        facets?: SearchPageFacetConfig[];
      };

  export type AskAiConfig = {
    assistantId: DocSearchAskAi['assistantId'];
    suggestedQuestions?: DocSearchAskAi['suggestedQuestions'];
    searchParameters?: AgentStudioSearchParameters;
    indices?: AgentStudioIndices[];
    memory?: DocSearchAskAi['memory'];
    promptSuggestions?: DocSearchAskAi['promptSuggestions'];
  };

  export type DocusaurusSearchBarAskAiProps = AskAiConfig &
    Pick<DocSearchAskAi, 'tools'>;

  // DocSearch props that Docusaurus exposes directly through props forwarding
  type DocusaurusDocSearchProps = Pick<
    DocSearchProps,
    | 'apiKey'
    | 'appId'
    | 'disableUserPersonalization'
    | 'facets'
    | 'getMissingResultsUrl'
    | 'indices'
    | 'initialQuery'
    | 'insights'
    | 'keyboardShortcuts'
    | 'maxResultsPerGroup'
    | 'placeholder'
    | 'recentSearchesLimit'
    | 'recentSearchesWithFavoritesLimit'
    | 'resultBadgeKey'
    | 'translations'
  > & {
    indices: NonNullable<DocSearchProps['indices']>;
    askAi?: AskAiConfig;
    sidePanel?: DocusaurusSidePanelConfig;
  };

  export type ThemeConfigDocSearch = DocusaurusDocSearchProps & {
    // Docusaurus custom options, not coming from DocSearch
    contextualSearch: boolean;
    externalUrlRegex?: string;
    searchPage: SearchPageConfig;
    replaceSearchResultPathname?: {
      from: string;
      to: string;
    };
  };

  export type DocusaurusSearchBarProps = Partial<
    Omit<ThemeConfigDocSearch, 'askAi' | 'sidePanel'> & {
      askAi?: DocusaurusSearchBarAskAiProps;
      sidePanel?: DocusaurusSearchBarSidePanelProps;
    }
  >;

  type UserDocSearchConfig = Omit<
    Partial<ThemeConfigDocSearch>,
    'apiKey' | 'appId' | 'askAi' | 'indices'
  > & {
    appId: ThemeConfigDocSearch['appId'];
    apiKey: ThemeConfigDocSearch['apiKey'];
    indices: ThemeConfigDocSearch['indices'];
    askAi?: AskAiConfig;
  };

  export type ThemeConfig = {
    docsearch?: ThemeConfigDocSearch;
  };

  export type UserThemeConfig = {
    docsearch?: UserDocSearchConfig;
  };
}

declare module '@theme/SearchPage' {
  import type { ReactNode } from 'react';

  export default function SearchPage(): ReactNode;
}

declare module '@theme/SearchBar' {
  import type { DocusaurusSearchBarProps } from '@docsearch/docusaurus-adapter';
  import type { ReactNode } from 'react';

  export default function SearchBar(
    props?: DocusaurusSearchBarProps
  ): ReactNode;
}

declare module '@theme/SearchTranslations' {
  import type { DocSearchTranslations } from '@docsearch/react';

  const translations: DocSearchTranslations & {
    placeholder: string;
  };
  export default translations;
}
