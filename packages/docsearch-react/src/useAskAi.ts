import { useState, useCallback, useMemo, useRef } from 'react';

import { algoliaGenAiToolkit, type AskAiResponse, type GenAiClient, type GenAiClientOptions } from './lib/genAiClient';
import type { StoredSearchPlugin } from './stored-searches';
import type { StoredAskAiState } from './types';

type LoadingStatus = 'error' | 'idle' | 'loading' | 'streaming';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  context?: AskAiResponse['context'];
  urls?: Array<{ url: string; title?: string }>;
}

export interface AskAiState {
  messages: Message[];
  query: string;
  additionalFilters: string[];
  conversationId: string | null;
  loadingStatus: LoadingStatus;
  error: Error | null;
  // optional just to make the type flexible
  ask?: (params: AskParams) => Promise<void>;
  reset?: () => void;
  restoreConversation?: (conversation: StoredAskAiState) => void;
}

interface UseAskAiParams {
  genAiClient: GenAiClient;
  conversations: StoredSearchPlugin<StoredAskAiState>;
}

interface AskParams {
  query: string;
  additionalFilters?: Record<string, any>;
}

/**
 * Hook for interacting with Algolia's Generative AI API.
 *
 * @param params - Configuration options.
 * @param params.genAiClient - The GenAI client instance.
 * @param params.conversations - The conversations storage ref to store the AI responses.
 * @returns State and functions for interacting with the AI.
 */
export function useAskAi({ genAiClient, conversations }: UseAskAiParams): AskAiState {
  const initialState = useMemo(
    () => ({
      messages: [],
      query: '',
      additionalFilters: [],
      conversationId: null,
      loadingStatus: 'idle' as const,
      error: null,
    }),
    [],
  );

  const [state, setState] = useState<Omit<AskAiState, 'ask' | 'reset'>>(initialState);
  const didAddConversationRef = useRef(false);

  // reset state function
  const reset = useCallback(() => {
    setState(initialState);
    didAddConversationRef.current = false;
  }, [initialState]);

  const restoreConversation = useCallback(
    (conversation: StoredAskAiState) => {
      setState(conversation.askState ?? initialState);
      didAddConversationRef.current = true;
    },
    [initialState],
  );

  // ask ai request
  const ask = useCallback(
    async ({ query, additionalFilters }: AskParams) => {
      // if there's no conversationid, empty the messages
      if (!state.conversationId) {
        setState((prevState) => ({
          ...prevState,
          messages: [],
        }));
      }

      // generate a unique id for the user message
      const userMessageId = crypto.randomUUID();
      const assistantMessageId = crypto.randomUUID();
      const newConversationId = state.conversationId ?? crypto.randomUUID();

      // add user message to the conversation
      setState((prevState) => ({
        ...prevState,
        messages: [
          ...(prevState.conversationId ? prevState.messages : []), // keep history if we have a conversationId
          { id: userMessageId, role: 'user', content: query },
          { id: assistantMessageId, role: 'assistant', content: '', context: [], urls: [] },
        ],
        loadingStatus: 'loading',
        query,
        error: null,
      }));

      try {
        await genAiClient.fetchAskAiResponse({
          query,
          additionalFilters,
          // conversationId: newConversationId,
          onUpdate: (chunk) => {
            setState((prevState) => ({
              ...prevState,
              messages: prevState.messages.map((m) =>
                m.id === assistantMessageId
                  ? {
                      ...m,
                      content: chunk.response,
                      context: chunk.context,
                      urls: extractLinksFromText(chunk.response),
                    }
                  : m,
              ),
              loadingStatus: 'streaming',
            }));
          },

          onComplete: () => {
            setState((prevState) => {
              const newState = {
                ...prevState,
                loadingStatus: 'idle' as const,
                conversationId: prevState.conversationId ?? newConversationId,
              };

              if (!didAddConversationRef.current) {
                conversations.add({
                  query: newState.messages[0].content,
                  objectID: newConversationId,

                  // dummy content to make it a valid hit
                  // this is useful to show it among other hits
                  content: null,
                  hierarchy: {
                    lvl0: 'askAI',
                    lvl1: newState.messages[0].content,
                    lvl2: null,
                    lvl3: null,
                    lvl4: null,
                    lvl5: null,
                    lvl6: null,
                  },
                  type: 'askAI',
                  url: '',
                  url_without_anchor: '',
                  anchor: '',
                  askState: newState,
                });
                didAddConversationRef.current = true;
              }

              return newState;
            });
          },
          onError: (error) => {
            // handle errors during the stream
            setState((prevState) => ({
              ...prevState,
              loadingStatus: 'error',
              error,
            }));
          },
        });
      } catch (error) {
        setState((prevState) => ({
          ...prevState,
          loadingStatus: 'error',
          error: error instanceof Error ? error : new Error('unknown fetch error'),
        }));
      }
    },
    [genAiClient, conversations, state],
  );

  return {
    ...state,
    ask,
    reset,
    restoreConversation,
  };
}

/** Function signature for transforming the GenAI client. */
export type DocSearchTransformGenAiClient = (genAiClient: GenAiClient) => GenAiClient;

/**
 * Hook to create and memoize an Algolia Generative AI client instance.
 *
 * @param appId - Your Algolia Application ID.
 * @param apiKey - Your Algolia API Key.
 * @param options - GenAI client options (dataSourceId, promptID).
 * @param transformGenAiClient - Optional function to modify the client instance.
 * @returns A memoized GenAI client instance.
 */
export function useGenAiClient(
  appId: string,
  apiKey: string,
  options: GenAiClientOptions,
  transformGenAiClient: DocSearchTransformGenAiClient = (client) => client,
): GenAiClient | null {
  const genAiClient = useMemo(() => {
    if (!options.dataSourceId || !options.promptId) {
      return null;
    }
    const client = algoliaGenAiToolkit(appId, apiKey, options);

    // note: Currently, the genAiClient doesn't have a built-in `addAlgoliaAgent` method like the search client.
    // if needed in the future, agent logic would be added here.

    return transformGenAiClient(client);
  }, [appId, apiKey, options, transformGenAiClient]);

  return genAiClient;
}

// utility to extract links (markdown and bare urls) from a string
function extractLinksFromText(text: string): Array<{ url: string; title?: string }> {
  // match [title](url) and bare urls
  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const urlRegex = /https?:\/\/[^\s)]+/g;
  const links: Array<{ url: string; title?: string }> = [];
  const seen = new Set<string>();

  // extract markdown links first
  let match;
  while ((match = markdownLinkRegex.exec(text)) !== null) {
    let url = match[2];
    const title = match[1];
    // trim trailing punctuation
    url = url.replace(/[).,;!?]+$/, '');
    if (!seen.has(url)) {
      links.push({ url, title });
      seen.add(url);
    }
  }

  // extract bare urls
  while ((match = urlRegex.exec(text)) !== null) {
    let url = match[0];
    url = url.replace(/[).,;!?]+$/, '');
    if (!seen.has(url)) {
      links.push({ url });
      seen.add(url);
    }
  }

  return links;
}
