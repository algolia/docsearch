import { useState, useCallback, useMemo } from 'react';

import { algoliaGenAiToolkit, type AskAiResponse, type GenAiClient, type GenAiClientOptions } from './lib/genAiClient';

type LoadingStatus = 'error' | 'idle' | 'loading' | 'streaming';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

interface UseAskAiState {
  messages: Message[];
  currentResponse: string;
  additionalFilters: string[];
  context: AskAiResponse['context'];
  conversationID: string | null;
  loadingStatus: LoadingStatus;
  error: Error | null;
}

interface UseAskAiParams {
  genAiClient: GenAiClient;
}

interface AskParams {
  query: string;
  additionalFilters?: Record<string, any>;
}

interface UseAskAiReturn {
  messages: Message[];
  currentResponse: string;
  additionalFilters: string[];
  context: AskAiResponse['context'];
  conversationID: string | null;
  loadingStatus: LoadingStatus;
  error: Error | null;
  ask: (params: AskParams) => Promise<void>;
  resetState: () => void;
}

/**
 * Hook for interacting with Algolia's Generative AI API.
 *
 * @param params - Configuration options.
 * @param params.genAiClient - The GenAI client instance.
 * @returns State and functions for interacting with the AI.
 */
export function useAskAi({ genAiClient }: UseAskAiParams): UseAskAiReturn {
  const initialState = useMemo<UseAskAiState>(
    () => ({
      messages: [],
      currentResponse: '',
      additionalFilters: [],
      context: [],
      conversationID: null,
      loadingStatus: 'idle',
      error: null,
    }),
    [],
  );

  const [state, setState] = useState<UseAskAiState>(initialState);

  // reset state
  const resetState = useCallback(() => {
    setState(initialState);
  }, [initialState]);

  // ask ai request
  const ask = useCallback(
    async ({ query, additionalFilters }: AskParams) => {
      // generate a unique id for the user message
      const userMessageId = crypto.randomUUID();

      // Add user message to the conversation
      setState((prevState) => ({
        ...prevState,
        messages: [...prevState.messages, { role: 'user', content: query, id: userMessageId }],
        currentResponse: '',
        additionalFilters: [],
        context: [],
        loadingStatus: 'loading',
        error: null,
      }));

      try {
        await genAiClient.fetchAskAiResponse({
          query,
          additionalFilters,
          onUpdate: (chunk) => {
            // update state incrementally as data streams in
            setState((prevState) => ({
              ...prevState,
              currentResponse: chunk.response,
              additionalFilters: chunk.additionalFilters,
              context: chunk.context,
              conversationID: chunk.conversationID,
              loadingStatus: 'streaming',
            }));
          },
          onComplete: () => {
            // generate a unique id for the assistant message
            const assistantMessageId = crypto.randomUUID();

            // add the completed assistant message to the conversation
            setState((prevState) => ({
              ...prevState,
              messages: [
                ...prevState.messages,
                { role: 'assistant', content: prevState.currentResponse, id: assistantMessageId },
              ],
              loadingStatus: 'idle', // stream finished successfully
            }));
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
    [genAiClient],
  );

  return {
    ...state,
    ask,
    resetState,
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
