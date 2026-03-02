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

export interface AlgoliaMCPSearchTool {
  input: {
    query: string;
  };
  output: {
    hits?: any[];
    nbHits?: number;
  };
}

type Tools = {
  [K in `algolia_search_index_${string}`]: AlgoliaMCPSearchTool;
} & {
  searchIndex: SearchIndexTool;
  algolia_search_index: AgentStudioSearchTool;
};

export type AIMessage = UIMessage<{ stopped?: boolean }, UIDataTypes, Tools>;

export type AIMessagePart = UIMessagePart<UIDataTypes, Tools>;

export type AIToolPart = ToolUIPart<Tools>;

export function isAIToolPart(part: AIMessagePart): part is AIToolPart {
  return part.type.startsWith('tool-');
}
