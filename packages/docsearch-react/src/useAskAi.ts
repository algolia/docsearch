import type { UseChatHelpers } from '@ai-sdk/react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import { useCallback, useMemo, useRef } from 'react';

import { getAgentStudioErrorMessage, getValidToken, postFeedback } from './askai';
import type { Exchange } from './AskAiScreen';
import { ASK_AI_API_URL, BETA_ASK_AI_API_URL } from './constants';
import type { StoredSearchPlugin } from './stored-searches';
import { createStoredConversations } from './stored-searches';
import type { AIMessage } from './types/AskiAi';

import type { AgentStudioIndexSearchParameters, AskAiSearchParameters, StoredAskAiState } from '.';

type UseChat = UseChatHelpers<AIMessage>;

type UseAskAiParams = {
  assistantId?: string | null;
  apiKey: string;
  appId: string;
  indexName: string;
  useStagingEnv?: boolean;
  searchParameters?: AskAiSearchParameters;
  agentStudio: boolean;
} & (
  | {
      agentStudio: false;
      searchParameters?: AskAiSearchParameters;
    }
  | {
      agentStudio: true;
      searchParameters?: AgentStudioIndexSearchParameters;
    }
);

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

type AgentStudioTransportParams = Pick<UseAskAiParams, 'apiKey' | 'appId' | 'assistantId'> & {
  searchParameters?: AgentStudioIndexSearchParameters;
};

const getAgentStudioTransport = ({
  appId,
  apiKey,
  assistantId,
  searchParameters,
}: AgentStudioTransportParams): DefaultChatTransport<AIMessage> => {
  return new DefaultChatTransport({
    api: `https://${appId}.algolia.net/agent-studio/1/agents/${assistantId}/completions?stream=true&compatibilityMode=ai-sdk-5`,
    headers: {
      'x-algolia-application-id': appId,
      'x-algolia-api-key': apiKey,
    },
    body: searchParameters ? { algolia: { searchParameters } } : {},
  });
};

const getAskAiTransport = ({
  assistantId,
  apiKey,
  indexName,
  searchParameters,
  appId,
  abortController,
  useStagingEnv,
}: Pick<UseAskAiParams, 'apiKey' | 'appId' | 'assistantId' | 'indexName' | 'searchParameters' | 'useStagingEnv'> & {
  abortController: AbortController;
}): DefaultChatTransport<AIMessage> => {
  return new DefaultChatTransport({
    api: useStagingEnv ? BETA_ASK_AI_API_URL : ASK_AI_API_URL,
    headers: async (): Promise<Record<string, string>> => {
      if (!assistantId) {
        throw new Error('Ask AI assistant ID is required');
      }

      const token = await getValidToken({
        assistantId,
        abortSignal: abortController.signal,
        useStagingEnv,
      });

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
  });
};

export const useAskAi: UseAskAi = ({ assistantId, apiKey, appId, indexName, useStagingEnv = false, ...params }) => {
  const abortControllerRef = useRef(new AbortController());

  const askAiTransport = useMemo(
    () =>
      params.agentStudio
        ? getAgentStudioTransport({
            apiKey,
            appId,
            assistantId: assistantId ?? '',
            searchParameters: params.searchParameters,
          })
        : getAskAiTransport({
            assistantId: assistantId ?? '',
            apiKey,
            appId,
            indexName,
            searchParameters: params.searchParameters,
            abortController: abortControllerRef.current,
            useStagingEnv,
          }),
    [apiKey, appId, assistantId, indexName, useStagingEnv, params],
  );

  const { messages, sendMessage, status, setMessages, error, stop } = useChat({
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

  const askAiError = useMemo((): Error | undefined => {
    if (!error) return undefined;

    if (!params.agentStudio) return error;

    return getAgentStudioErrorMessage(error);
  }, [error, params.agentStudio]);

  return {
    messages,
    sendMessage,
    status,
    setMessages,
    askAiError,
    stopAskAiStreaming: onStopStreaming,
    isStreaming,
    exchanges,
    conversations,
    sendFeedback,
  };
};
