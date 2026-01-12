import type { UIMessage } from '@ai-sdk/react';
import type { UIDataTypes, UIMessagePart } from 'ai';

export type AskAiState =
  | 'conversation-history'
  | 'conversation'
  | 'generating-summary'
  | 'initial'
  | 'new-conversation';

export interface SearchIndexTool {
  input: {
    query: string;
  };
  output: {
    query?: string;
    hits?: any[];
  };
}

export type AIMessage = UIMessage<
  { stopped?: boolean },
  UIDataTypes,
  {
    searchIndex: SearchIndexTool;
  }
>;

export type AIMessagePart = UIMessagePart<
  UIDataTypes,
  {
    searchIndex: SearchIndexTool;
  }
>;
