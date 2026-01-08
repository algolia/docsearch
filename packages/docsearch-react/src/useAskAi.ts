import type { UseChatHelpers } from '@ai-sdk/react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import { useCallback, useMemo, useRef } from 'react';

import { getValidToken, postFeedback } from './askai';
import type { Exchange } from './AskAiScreen';
import { ASK_AI_API_URL, BETA_ASK_AI_API_URL, USE_ASK_AI_TOKEN } from './constants';
import type { StoredSearchPlugin } from './stored-searches';
import { createStoredConversations } from './stored-searches';
import type { AIMessage } from './types/AskiAi';

import type { AskAiSearchParameters, StoredAskAiState } from '.';

type UseChat = UseChatHelpers<AIMessage>;

type UseAskAiParams = {
  assistantId?: string | null;
  apiKey: string;
  appId: string;
  indexName: string;
  searchParameters?: AskAiSearchParameters;
  useStagingEnv?: boolean;
};

type UseAskAiReturn = {
  messages: AIMessage[];
  status: UseChat['status'];
  sendMessage: UseChat['sendMessage'];
  setMessages: UseChat['setMessages'];
  stopAskAiStreaming: UseChat['stop'];
  askAiError?: Error;
  isStreaming: boolean;
  exchanges: Exchange[];
  conversations: StoredSearchPlugin<StoredAskAiState>;
  sendFeedback: (messageId: string, thumbs: 0 | 1) => Promise<void>;
};

type UseAskAi = (params: UseAskAiParams) => UseAskAiReturn;

export const useAskAi: UseAskAi = ({
  assistantId,
  apiKey,
  appId,
  indexName,
  searchParameters,
  useStagingEnv = false,
}) => {
  const abortControllerRef = useRef(new AbortController());

  const askAiTransport = useMemo(
    () =>
      new DefaultChatTransport({
        api: useStagingEnv ? BETA_ASK_AI_API_URL : ASK_AI_API_URL,
        headers: async (): Promise<Record<string, string>> => {
          if (!assistantId) {
            throw new Error('Ask AI assistant ID is required');
          }

          let token: string | null = null;

          if (USE_ASK_AI_TOKEN) {
            token = await getValidToken({
              assistantId,
              abortSignal: abortControllerRef.current.signal,
              useStagingEnv,
            });
          }

          return {
            ...(token ? { authorization: `TOKEN ${token}` } : {}),
            'X-Algolia-API-Key': apiKey,
            'X-Algolia-Application-Id': appId,
            'X-Algolia-Index-Name': indexName,
            'X-Algolia-Assistant-Id': assistantId || '',
            'X-AI-SDK-Version': 'v5',
          };
        },
        body: searchParameters ? { searchParameters } : {},
      }),
    [apiKey, appId, assistantId, indexName, searchParameters, useStagingEnv],
  );

  const { messages, sendMessage, status, setMessages, error, stop } = useChat<AIMessage>({
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    transport: askAiTransport,
  });

  const conversations = useRef(
    createStoredConversations<StoredAskAiState>({
      key: `__DOCSEARCH_ASKAI_CONVERSATIONS__${indexName}`,
      limit: 10,
    }),
  ).current;

  const sendFeedback = useCallback(
    async (messageId: string, thumbs: 0 | 1): Promise<void> => {
      if (!assistantId) return;

      const res = await postFeedback({
        assistantId,
        thumbs,
        messageId,
        appId,
        abortSignal: abortControllerRef.current.signal,
        useStagingEnv,
      });

      if (res.status >= 300) throw new Error('Failed, try again later.');
      conversations.addFeedback?.(messageId, thumbs === 1 ? 'like' : 'dislike');
    },
    [assistantId, appId, conversations, useStagingEnv],
  );

  const onStopStreaming = async (): Promise<void> => {
    abortControllerRef.current.abort();
    await stop();
  };

  const exchanges = useMemo(() => {
    const grouped: Exchange[] = [];

    for (let i = 0; i < messages.length; i++) {
      if (messages[i].role === 'user') {
        const userMessage = messages[i];
        const assistantMessage = messages[i + 1]?.role === 'assistant' ? messages[i + 1] : null;
        grouped.push({ id: userMessage.id, userMessage, assistantMessage });
        if (assistantMessage) {
          i++;
        }
      }
    }

    return grouped;
  }, [messages]);

  const isStreaming = status === 'streaming' || status === 'submitted';

  return {
    messages,
    sendMessage,
    status,
    setMessages,
    askAiError: error,
    stopAskAiStreaming: onStopStreaming,
    isStreaming,
    exchanges,
    conversations,
    sendFeedback,
  };
};
