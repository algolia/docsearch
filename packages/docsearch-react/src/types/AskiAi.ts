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

interface MCPSearchToolQuery {
  query: string;
  [key: string]: unknown;
}

interface MCPSearchToolInputV1 {
  query: string;
  index: string;
  number_of_results?: number;
  facet_filters?: string[];
}

interface MCPSearchToolInputV2 {
  queries: MCPSearchToolQuery[];
  clickAnalytics: boolean;
  originalQuery: string;
}

export interface AlgoliaMCPSearchToolOutput {
  hits?: unknown[];
  nbHits?: number;
  queryId?: string;
}

export type AlgoliaMCPSearchTool =
  | {
      input: MCPSearchToolInputV2;
      output: AlgoliaMCPSearchToolOutput | undefined;
    }
  | { input: MCPSearchToolInputV1; output: AlgoliaMCPSearchToolOutput };

type Tools = {
  [K in `algolia_search_index_${string}`]: AlgoliaMCPSearchTool;
} & {
  searchIndex: SearchIndexTool;
  algolia_search_index: AlgoliaMCPSearchTool;
};

export type AIMessage = UIMessage<{ stopped?: boolean }, UIDataTypes, Tools>;

export type AIMessagePart = UIMessagePart<UIDataTypes, Tools>;

export type AIToolPart = ToolUIPart<Tools>;

export function isAIToolPart(part: AIMessagePart): part is AIToolPart {
  return part.type.startsWith('tool-');
}
