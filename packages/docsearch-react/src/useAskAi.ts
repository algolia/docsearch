import type { UseChatHelpers } from '@ai-sdk/react';
import { useChat } from '@ai-sdk/react';
import type { ChatOnToolCallCallback } from 'ai';
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from 'ai';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import { agentStudioBaseUrl, getAgentStudioErrorMessage, postAgentStudioFeedback } from './askai';
import type { Exchange } from './AskAiScreen';
import type { StoredSearchPlugin } from './stored-searches';
import { createStoredConversations } from './stored-searches';
import { type AIMessage, type ToolCalls } from './types/AskiAi';
import { EMPTY_TOOLS } from './utils/ai';

import type { AgentStudioSearchParameters, Memory, StoredAskAiState } from '.';

type UseChat = UseChatHelpers<AIMessage>;

type UseAskAiParams = {
  assistantId?: string | null;
  apiKey: string;
  appId: string;
  indexName: string;
  searchParameters?: AgentStudioSearchParameters;
  tools: ToolCalls;
  memory?: Memory;
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

type AgentStudioTransportParams = Pick<UseAskAiParams, 'apiKey' | 'appId' | 'assistantId'> & {
  searchParameters?: AgentStudioSearchParameters;
  userToken?: string;
};

const getAgentStudioTransport = ({
  appId,
  apiKey,
  assistantId,
  searchParameters,
  userToken,
}: AgentStudioTransportParams): DefaultChatTransport<AIMessage> => {
  return new DefaultChatTransport({
    api: `${agentStudioBaseUrl(appId)}/agents/${assistantId}/completions?stream=true&compatibilityMode=ai-sdk-5`,
    headers: {
      'x-algolia-application-id': appId,
      'x-algolia-api-key': apiKey,
      ...(userToken ? { 'x-algolia-secure-user-token': userToken } : {}),
    },
    body: searchParameters ? { algolia: { searchParameters } } : {},
  });
};

export const useAskAi: UseAskAi = ({
  assistantId,
  apiKey,
  appId,
  indexName,
  tools = EMPTY_TOOLS,
  searchParameters,
  memory,
}) => {
  const abortControllerRef = useRef(new AbortController());

  const askAiTransport = useMemo(
    () =>
      getAgentStudioTransport({
        apiKey,
        appId,
        assistantId: assistantId ?? '',
        searchParameters,
        userToken: memory?.userToken,
      }),
    [apiKey, appId, assistantId, searchParameters, memory?.userToken],
  );

  // Sync ref during render so the stable `handleToolCall` (registered once
  // by useChat) always sees the latest `tools` without re-creating itself.
  // Safe because tool calls only fire after a commit, and writes are idempotent.
  const toolsRef = useRef(tools);
  toolsRef.current = tools;

  const addToolOutputRef = useRef<UseChat['addToolOutput'] | null>(null);

  const handleToolCall: ChatOnToolCallCallback<AIMessage> = useCallback(({ toolCall }) => {
    const tool = toolsRef.current[toolCall.toolName];
    if (!tool?.onToolCall) {
      return;
    }

    tool.onToolCall({
      ...toolCall,
      addToolOutput: async ({ output }) => {
        if (!addToolOutputRef.current) return;

        await addToolOutputRef.current({
          output,
          tool: toolCall.toolName,
          toolCallId: toolCall.toolCallId,
        });
      },
    });
  }, []);

  const { messages, sendMessage, status, setMessages, error, stop, addToolOutput } = useChat({
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    transport: askAiTransport,
    onToolCall: handleToolCall,
  });

  useEffect(() => {
    addToolOutputRef.current = addToolOutput;
  }, [addToolOutput]);

  const conversations = useRef(
    createStoredConversations<StoredAskAiState>({
      key: `__DOCSEARCH_ASKAI_CONVERSATIONS__${indexName}`,
      limit: 10,
    }),
  ).current;

  const sendFeedback = useCallback(
    async (messageId: string, thumbs: 0 | 1): Promise<void> => {
      if (!assistantId) return;

      const res = await postAgentStudioFeedback({
        agentId: assistantId,
        vote: thumbs,
        messageId,
        appId,
        apiKey,
        abortSignal: abortControllerRef.current.signal,
      });

      if (res.status >= 300) throw new Error('Failed, try again later.');
      conversations.addFeedback?.(messageId, thumbs === 1 ? 'like' : 'dislike');
    },
    [assistantId, appId, apiKey, conversations],
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

    return getAgentStudioErrorMessage(error);
  }, [error]);

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
