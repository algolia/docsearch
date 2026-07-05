import type { UseChatHelpers } from '@ai-sdk/react';
import { useChat } from '@ai-sdk/react';
import type { ChatRequestOptions } from 'ai';
import { DefaultChatTransport, generateId, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { MutableRefObject } from 'react';

import {
  agentStudioBaseUrl,
  getAgentStudioErrorMessage,
  getValidToken,
  postAgentStudioFeedback,
  postFeedback,
} from './askai';
import type { Exchange } from './AskAiScreen';
import { ASK_AI_API_URL, BETA_ASK_AI_API_URL } from './constants';
import type { StoredSearchPlugin } from './stored-searches';
import { createStoredConversations } from './stored-searches';
import type { AIMessage } from './types/AskiAi';

import type { AgentStudioSearchParameters, AskAiSearchParameters, StoredAskAiState } from '.';

type UseChat = UseChatHelpers<AIMessage>;

/**
 * After rotating `useChat` `id`, run this on the **new** chat (see `resetAskAiChatSession`).
 */
export type AskAiPendingAfterSessionReset =
  | {
      kind: 'sendUserMessage';
      message: {
        role: 'user';
        parts: Array<{ type: 'text'; text: string }>;
      };
      requestOptions?: ChatRequestOptions;
    }
  | { kind: 'sendText'; text: string; requestOptions?: ChatRequestOptions }
  | { kind: 'setMessages'; messages: AIMessage[] };

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
      searchParameters?: AgentStudioSearchParameters;
    }
);

type UseAskAiReturn = {
  messages: AIMessage[];
  status: UseChat['status'];
  sendMessage: UseChat['sendMessage'];
  setMessages: UseChat['setMessages'];
  clearError: UseChat['clearError'];
  resetAskAiAbortScope: () => void;
  resetAskAiChatSession: (pending?: AskAiPendingAfterSessionReset) => void;
  stopAskAiStreaming: UseChat['stop'];
  askAiError?: Error;
  isStreaming: boolean;
  exchanges: Exchange[];
  conversations: StoredSearchPlugin<StoredAskAiState>;
  sendFeedback: (messageId: string, thumbs: 0 | 1) => Promise<void>;
};

type UseAskAi = (params: UseAskAiParams) => UseAskAiReturn;

type AgentStudioTransportParams = Pick<UseAskAiParams, 'apiKey' | 'appId' | 'assistantId'> & {
  searchParameters?: AgentStudioSearchParameters;
};

const getAgentStudioTransport = ({
  appId,
  apiKey,
  assistantId,
  searchParameters,
}: AgentStudioTransportParams): DefaultChatTransport<AIMessage> => {
  return new DefaultChatTransport({
    api: `${agentStudioBaseUrl(appId)}/agents/${assistantId}/completions?stream=true&compatibilityMode=ai-sdk-5`,
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
  abortControllerRef,
  useStagingEnv,
}: Pick<UseAskAiParams, 'apiKey' | 'appId' | 'assistantId' | 'indexName' | 'searchParameters' | 'useStagingEnv'> & {
  abortControllerRef: MutableRefObject<AbortController>;
}): DefaultChatTransport<AIMessage> => {
  return new DefaultChatTransport({
    api: useStagingEnv ? BETA_ASK_AI_API_URL : ASK_AI_API_URL,
    headers: async (): Promise<Record<string, string>> => {
      if (!assistantId) {
        throw new Error('Ask AI assistant ID is required');
      }

      const token = await getValidToken({
        assistantId,
        abortSignal: abortControllerRef.current.signal,
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
  const [chatSessionId, setChatSessionId] = useState(() => generateId());
  const pendingAfterChatSessionResetRef = useRef<AskAiPendingAfterSessionReset | null>(null);
  const sendMessageRef = useRef<UseChat['sendMessage'] | null>(null);
  const setMessagesRef = useRef<UseChat['setMessages'] | null>(null);

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
            abortControllerRef,
            useStagingEnv,
          }),
    [apiKey, appId, assistantId, indexName, useStagingEnv, params],
  );

  const chatOptions = useMemo(
    () => ({
      id: chatSessionId,
      sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
      transport: askAiTransport,
    }),
    [chatSessionId, askAiTransport],
  );

  const { messages, sendMessage, status, setMessages, error, stop, clearError } = useChat(chatOptions);

  sendMessageRef.current = sendMessage;
  setMessagesRef.current = setMessages;

  const conversations = useRef(
    createStoredConversations<StoredAskAiState>({
      key: `__DOCSEARCH_ASKAI_CONVERSATIONS__${indexName}`,
      limit: 10,
    }),
  ).current;

  const sendFeedback = useCallback(
    async (messageId: string, thumbs: 0 | 1): Promise<void> => {
      if (!assistantId) return;

      const res = await (params.agentStudio
        ? postAgentStudioFeedback({
            agentId: assistantId,
            vote: thumbs,
            messageId,
            appId,
            apiKey,
            abortSignal: abortControllerRef.current.signal,
          })
        : postFeedback({
            assistantId,
            thumbs,
            messageId,
            appId,
            abortSignal: abortControllerRef.current.signal,
            useStagingEnv,
          }));

      if (res.status >= 300) throw new Error('Failed, try again later.');
      conversations.addFeedback?.(messageId, thumbs === 1 ? 'like' : 'dislike');
    },
    [assistantId, params.agentStudio, appId, apiKey, useStagingEnv, conversations],
  );

  const resetAskAiAbortScope = useCallback((): void => {
    abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
  }, []);

  const resetAskAiChatSession = useCallback(
    (pending?: AskAiPendingAfterSessionReset): void => {
      resetAskAiAbortScope();
      pendingAfterChatSessionResetRef.current = pending ?? null;
      setChatSessionId(generateId());
    },
    [resetAskAiAbortScope],
  );

  useEffect(() => {
    const pending = pendingAfterChatSessionResetRef.current;
    if (pending === null) return;

    const send = sendMessageRef.current;
    const setMsgs = setMessagesRef.current;

    if (pending.kind === 'sendText') {
      if (!send) return;
      pendingAfterChatSessionResetRef.current = null;
      send({ text: pending.text }, pending.requestOptions ?? {});
      return;
    }
    if (pending.kind === 'sendUserMessage') {
      if (!send) return;
      pendingAfterChatSessionResetRef.current = null;
      send(pending.message, pending.requestOptions ?? {});
      return;
    }
    if (!setMsgs) return;
    pendingAfterChatSessionResetRef.current = null;
    setMsgs(pending.messages);
  }, [chatSessionId]);

  const onStopStreaming = async (): Promise<void> => {
    abortControllerRef.current.abort();
    await stop();
    abortControllerRef.current = new AbortController();
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
    clearError,
    resetAskAiAbortScope,
    resetAskAiChatSession,
    askAiError,
    stopAskAiStreaming: onStopStreaming,
    isStreaming,
    exchanges,
    conversations,
    sendFeedback,
  };
};
