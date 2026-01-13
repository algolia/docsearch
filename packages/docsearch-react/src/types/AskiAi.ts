import type { UIMessage } from '@ai-sdk/react';
import type { ToolUIPart, UIDataTypes, UIMessagePart } from 'ai';

export type AskAiState = 'conversation-history' | 'conversation' | 'initial' | 'new-conversation';

export interface SearchIndexTool {
  input: {
    query: string;
  };
  output: {
    query?: string;
    hits?: any[];
  };
}

export interface AgentStudioSearchTool {
  input: {
    index: string;
    query: string;
    number_of_results: number;
    facet_filters: any | null;
  };
  output: {
    hits?: any[];
    nbHits?: number;
    queryID?: string;
  };
}

type Tools = {
  searchIndex: SearchIndexTool;
  algolia_search_index: AgentStudioSearchTool;
};

export type AIMessage = UIMessage<{ stopped?: boolean }, UIDataTypes, Tools>;

export type AIMessagePart = UIMessagePart<UIDataTypes, Tools>;

export type AIToolPart = ToolUIPart<Tools>;
