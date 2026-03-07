/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

declare module '@docsearch/docusaurus-adapter' {
  import type { DocSearchProps } from '@docsearch/react';
  import type { SidepanelProps } from '@docsearch/react/sidepanel';
  import type { FacetFilters } from 'algoliasearch/lite';
  import type { DeepPartial, Overwrite, Optional } from 'utility-types';

  type AskAiSearchParameters = {
    facetFilters?: FacetFilters;
    filters?: string;
    attributesToRetrieve?: string[];
    restrictSearchableAttributes?: string[];
    distinct?: boolean | number | string;
  };

  type AgentStudioSearchParameters = Record<string, Omit<AskAiSearchParameters, 'facetFilters'>>;

  // The config after normalization (e.g. AskAI string -> object)
  // This matches DocSearch v4.3+ AskAi configuration
  export type AskAiConfig = {
    indexName: string;
    apiKey: string;
    appId: string;
    assistantId: string;
    suggestedQuestions?: boolean;
    useStagingEnv?: boolean;
    sidePanel?: boolean | (SidepanelProps & { hideButton?: boolean });
  } & (
    | {
        agentStudio: false;
        searchParameters?: AskAiSearchParameters;
      }
    | {
        agentStudio: true;
        searchParameters?: AgentStudioSearchParameters;
      }
    | {
        agentStudio?: never;
        searchParameters?: AskAiSearchParameters;
      }
  );

  // DocSearch props that Docusaurus exposes directly through props forwarding
  type DocusaurusDocSearchProps = Pick<
    DocSearchProps,
    'apiKey' | 'appId' | 'indexName' | 'initialQuery' | 'insights' | 'placeholder' | 'searchParameters' | 'translations'
  > & {
    // Docusaurus normalizes the AskAI config to an object
    askAi?: AskAiConfig;
  };

  export type ThemeConfigAlgolia = DocusaurusDocSearchProps & {
    indexName: string;

    // Docusaurus custom options, not coming from DocSearch
    contextualSearch: boolean;
    externalUrlRegex?: string;
    searchPagePath: string | false | null;
    replaceSearchResultPathname?: {
      from: string;
      to: string;
    };
  };

  type UserDocSearchConfig = Overwrite<
    DeepPartial<ThemeConfigAlgolia>,
    {
      // Required fields:
      appId: ThemeConfigAlgolia['appId'];
      apiKey: ThemeConfigAlgolia['apiKey'];
      indexName: ThemeConfigAlgolia['indexName'];
      // askAi also accepts a shorter string form
      askAi?: Optional<AskAiConfig, 'apiKey' | 'appId' | 'indexName'> | string;
    }
  >;

  export type ThemeConfig = {
    // Preferred key.
    docsearch?: ThemeConfigAlgolia;
    // Backward-compatible alias.
    algolia?: ThemeConfigAlgolia;
  };

  export type UserThemeConfig = {
    // Preferred key.
    docsearch?: UserDocSearchConfig;
    // Backward-compatible alias.
    algolia?: UserDocSearchConfig;
  };
}

declare module '@theme/SearchPage' {
  import type { ReactNode } from 'react';

  export default function SearchPage(): ReactNode;
}

declare module '@theme/SearchBar' {
  import type { ReactNode } from 'react';

  export default function SearchBar(): ReactNode;
}

declare module '@theme/SearchTranslations' {
  import type { DocSearchTranslations } from '@docsearch/react';

  const translations: DocSearchTranslations & {
    placeholder: string;
  };
  export default translations;
}
