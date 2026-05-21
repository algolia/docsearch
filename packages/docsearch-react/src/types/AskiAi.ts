import type { UIMessage } from '@ai-sdk/react';
import { type ToolUIPart, type UIDataTypes, type UIMessagePart } from 'ai';

export type AskAiState = 'conversation-history' | 'conversation' | 'initial' | 'new-conversation';

export interface CustomTool {
  input: unknown;
  output: unknown;
}

export interface SearchIndexTool {
  input: {
    query: string;
  };
  output: {
    query?: string;
    hits?: any[];
  };
}

export interface AlgoliaMCPSearchTool {
  input: {
    query: string;
    index: string;
    number_of_results?: number;
    facet_filters?: string[];
  };
  output: {
    hits?: any[];
    nbHits?: number;
    queryId?: string;
  };
}

export type ToolDefinition = {
  /**
   * Use the tool's input and output to build a string output for the tool result.
   */
  render: (params: { message: { input: unknown; output: unknown } }) => string;
  /**
   * Optional callback function that is invoked when a tool call is received. You must call addToolOutput to provide the tool result.
   */
  onToolCall?: (params: {
    input: unknown;
    addToolOutput: (props: { output: unknown }) => Promise<void>;
    toolCallId: string;
    toolName: string;
    dynamic?: boolean;
  }) => Promise<void> | void;
  translations?: Partial<{
    /**
     * The text displayed before tool call output is available.
     */
    callingToolText: string;
  }>;
};

export type ToolCalls = Record<string, ToolDefinition>;

type SearchTools = {
  [K in `algolia_search_index_${string}`]: AlgoliaMCPSearchTool;
} & {
  algolia_search_index: AlgoliaMCPSearchTool;
  searchIndex: SearchIndexTool;
};
type CustomTools = {
  [K in string as K extends keyof SearchTools | `algolia_search_index_${string}` ? never : K]: CustomTool;
};
type Tools = CustomTools & SearchTools;

export type AIMessage = UIMessage<{ stopped?: boolean }, UIDataTypes, Tools>;

export type AIMessagePart = UIMessagePart<UIDataTypes, Tools>;

export type SearchToolPart = ToolUIPart<SearchTools>;
export type AIToolPart = ToolUIPart<Tools>;

export interface AggregatedToolCallPart {
  type: 'aggregated-tool-call';
  queries: string[];
}
