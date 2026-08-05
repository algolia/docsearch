import { DocSearch as DocSearchProvider, useDocSearch } from '@docsearch/core';
import type { DocSearchRef, InitialAskAiMessage } from '@docsearch/core';
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
   * The API key to use for the ask AI feature. Your assistant will use this API
   * key to search the index. If not provided, the API key will be used.
   */
  apiKey?: string;
  /**
   * The app ID to use for the ask AI feature. Your assistant will use this app
   * ID to search the index. If not provided, the app ID will be used.
   */
  appId?: string;
  /** The Agent Studio Agent ID to use for the Ask AI feature. */
  agentId: string;
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
  /**
   * Index names for the Agent Studio search tool on this request.
   *
   * Agent Studio expects names only. Put descriptions and tool defaults on the
   * agent configuration. Put per-index runtime overrides in
   * `searchParameters`.
   */
  indices?: string[];
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
  { appId, apiKey, ...props }: DocSearchAIProps,
  ref: React.ForwardedRef<DocSearchRef>
): JSX.Element {
  return (
    <DocSearchProvider {...props} appId={appId} apiKey={apiKey} ref={ref}>
      <DocSearchAIInner {...props} />
    </DocSearchProvider>
  );
}

export const DocSearchAI = React.forwardRef(DocSearchAIComponent);

export function DocSearchAIInner(
  props: Omit<DocSearchAIProps, 'appId' | 'apiKey'>
): JSX.Element {
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
    appId,
    apiKey,
  } = useDocSearch();

  if (!appId || !apiKey) {
    throw new Error('`DocSearchAI` requires `appId` and `apiKey` props.');
  }

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
            appId={appId}
            apiKey={apiKey}
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
