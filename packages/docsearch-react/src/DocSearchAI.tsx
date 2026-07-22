import { DocSearch as DocSearchProvider, useDocSearch } from '@docsearch/core';
import type { DocSearchRef, InitialAskAiMessage } from '@docsearch/core';
import type { SearchParamsObject } from 'algoliasearch/lite';
import React, { type JSX } from 'react';
import { createPortal } from 'react-dom';

import type { DocSearchProps } from './DocSearch';
import { DocSearchAskAiModal } from './DocSearchAskAiModal';
import { DocSearchButton } from './DocSearchButton';
import type { ToolCalls } from './types/AskiAi';

export interface AskAiSearchParameters {
  facetFilters?: string[];
  filters?: string;
  attributesToRetrieve?: string[];
  restrictSearchableAttributes?: string[];
  distinct?: boolean | number | string;
}

export type AgentStudioSearchParameters = Record<
  string,
  Omit<AskAiSearchParameters, 'facetFilters'>
>;

interface IndexTextParam {
  exposed: boolean;
  default?: string;
}

interface NumberConstraint {
  min?: number;
  max?: number;
}

interface IndexNumberParam {
  exposed: boolean;
  default?: number;
  constraint?: NumberConstraint;
}

interface StringArrayConstraints {
  values?: string[];
}

interface IndexStringArrayParam {
  exposed: boolean;
  default?: string[];
  constraint?: StringArrayConstraints;
  merge?: boolean;
}

interface IndexFacetParam {
  exposed: false;
  default?: string[];
}

export interface AgentStudioSearchControls {
  /**
   * Augmented query for the MCP search tool to use.
   *
   * @default undefined
   */
  query?: IndexTextParam;
  /**
   * Number of hits for the MCP to return per page.
   *
   * @default { exposed: false, default: 7 }
   */
  hits_per_page?: IndexNumberParam;
  /**
   * The page number the MCP should pull results from.
   *
   * @default { exposed: false, default: 0 }
   */
  page?: IndexNumberParam;
  /**
   * List of attributes that the MCP can retrieve from the index.
   *
   * @default { exposed: false, default: ['*'] }
   */
  attributesToRetrieve?: IndexStringArrayParam;
  /**
   * List of fields that the MCP will return to the Agent.
   *
   * @default { exposed: false, default: ["hits", "nbHits", "page", "nbPages", "hitsPerPage", "facets"] }
   */
  responseFields?: IndexStringArrayParam;
  /**
   * Defined facets the MCP will use when querying the index.
   *
   * @default undefined
   */
  facets?: IndexFacetParam;
  /**
   * Any other custom properties the MCP should send when querying the index.
   *
   * @default undefined
   */
  custom?: Record<string, unknown>;
}

export interface AgentStudioIndices {
  /** The name of the index used by the search tool. */
  index: string;
  /** A brief description for the search tool. */
  description: string;
  /**
   * A description used to steer the agent on how/when to use the search tool.
   *
   * @default ''
   */
  enhancedDescription?: string;
  /**
   * Default search parameters for the internal (non-MCP) search tool path.
   *
   * @default undefined
   */
  searchParameters?: SearchParamsObject;
  /**
   * Structured search parameters for the MCP-based search tool path.
   *
   * Each parameter controls whether it is exposed to the LLM and it's default
   * value.
   *
   * @default undefined
   */
  searchControls?: AgentStudioSearchControls;
}

export interface Memory {
  /**
   * Determines whether or not to display the memory based tool calls.
   *
   * @default false
   */
  enabled?: boolean;
  /**
   * The JWT used by the agent to know which user's memory to read.
   *
   * @see https://www.algolia.com/doc/guides/algolia-ai/agent-studio/how-to/user-authentication
   */
  userToken?: string;
}

export interface PromptSuggestions {
  /** The name of the index where the prompt suggestions are stored. */
  indexName: string;
  /**
   * The number of prompt suggestions that are retrieved and displayed.
   *
   * @default 3
   */
  hitsPerPage?: number;
}

export interface DocSearchAskAi {
  /**
   * The index name to use for the Ask AI feature. Your assistant will search
   * for relevant documents. If not provided, the root index name will be used.
   */
  indexName?: string;
  /**
   * The API key to use for the ask AI feature. Your assistant will use this API
   * key to search the index. If not provided, the API key will be used.
   */
  apiKey?: string;
  /**
   * The app ID to use for the ask AI feature. Your assistant will use this app
   * ID to search the index. If not provided, the app ID will be used.
   */
  appId?: string;
  /** The assistant ID to use for the ask AI feature. */
  assistantId: string;
  /**
   * Enables displaying suggested questions on Ask AI's new conversation screen.
   *
   * @default false
   */
  suggestedQuestions?: boolean;
  /**
   * The search parameters to use for the ask AI feature. Keyed by the index
   * name.
   *
   * @example
   *   {
   *   "INDEX_NAME": { distinct: false }
   *   }
   */
  searchParameters?: AgentStudioSearchParameters;
  /** List of dynamic indices for the Agent Studio search tool to use. */
  indices?: AgentStudioIndices[];
  /**
   * Use custom tools driven by Agent Studio.
   *
   * For best performance, memoize this object with `useMemo` or define it
   * outside the component. Inline object literals will be recreated every
   * render but will not affect correctness.
   */
  tools?: ToolCalls;
  /**
   * Configuration for the Agent Studio memory feature.
   *
   * @example
   *   { enabled: true, userToken: '{{SERVER_GENERATED_JWT_TOKEN}}' }
   *
   * @see https://www.algolia.com/doc/guides/algolia-ai/agent-studio/how-to/memory/overview
   */
  memory?: Memory;
  /**
   * Enables and configures prompt suggestions that are displayed during keyword
   * search.
   *
   * @example
   *   { indexName: 'docsearch-markdown_prompt_suggestions', hitsPerPage: 1 }
   *
   * @see https://www.algolia.com/doc/guides/algolia-ai/agent-studio/how-to/integration#prompt-suggestions
   */
  promptSuggestions?: PromptSuggestions;
}

export interface DocSearchAIProps extends DocSearchProps {
  /**
   * Configuration or assistant id to enable ask ai mode. Pass a string
   * assistant id or a full config object.
   */
  askAi: DocSearchAskAi | string;
  /**
   * Intercept Ask AI requests (e.g. Submitting a prompt or selecting a
   * suggested question).
   *
   * Return `true` to prevent the default modal Ask AI flow (no toggle, no
   * sendMessage). Useful to route Ask AI into a different UI (e.g.
   * `@docsearch/sidepanel-js`) without flicker.
   */
  interceptAskAiEvent?: (initialMessage: InitialAskAiMessage) => boolean | void;
}

function DocSearchAIComponent(
  props: DocSearchAIProps,
  ref: React.ForwardedRef<DocSearchRef>
): JSX.Element {
  return (
    <DocSearchProvider {...props} ref={ref}>
      <DocSearchAIInner {...props} />
    </DocSearchProvider>
  );
}

export const DocSearchAI = React.forwardRef(DocSearchAIComponent);

export function DocSearchAIInner(props: DocSearchAIProps): JSX.Element {
  const {
    searchButtonRef,
    keyboardShortcuts,
    isModalActive,
    isAskAiActive,
    initialQuery,
    onAskAiToggle,
    openModal,
    closeModal,
    isHybridModeSupported,
  } = useDocSearch();

  return (
    <>
      <DocSearchButton
        keyboardShortcuts={keyboardShortcuts}
        ref={searchButtonRef}
        translations={props.translations?.button}
        onClick={openModal}
      />
      {isModalActive &&
        createPortal(
          <DocSearchAskAiModal
            {...props}
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
            translations={props?.translations?.modal}
            isAskAiActive={isAskAiActive}
            isHybridModeSupported={isHybridModeSupported}
            onAskAiToggle={onAskAiToggle}
            onClose={closeModal}
          />,
          props.portalContainer ?? document.body
        )}
    </>
  );
}

export type { ToolCalls } from './types/AskiAi';
