import type { UIMessage } from '@ai-sdk/react';
import { type ToolUIPart, type UIMessagePart } from 'ai';

export type AskAiState =
  | 'conversation-history'
  | 'conversation'
  | 'initial'
  | 'new-conversation';

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

export interface AlgoliaMCPSearchTool {
  input: MCPSearchToolInputV1 | MCPSearchToolInputV2;
  output:
    | {
        hits?: unknown[];
        nbHits?: number;
        queryId?: string;
      }
    | undefined;
}

export interface MemoryTool {
  input: unknown;
  output: unknown;
}

export type ToolDefinition = {
  /**
   * Use the tool's input and output to build a string output for the tool
   * result.
   */
  render: (params: { message: { input: unknown; output: unknown } }) => string;
  /**
   * Optional callback function that is invoked when a tool call is received.
   * You must call addToolOutput to provide the tool result.
   */
  onToolCall?: (params: {
    input: unknown;
    addToolOutput: (props: { output: unknown }) => Promise<void>;
    toolCallId: string;
    toolName: string;
    dynamic?: boolean;
  }) => Promise<void> | void;
  translations?: Partial<{
    /** The text displayed before tool call output is available. */
    callingToolText: string;
  }>;
};

export type ToolCalls = Record<string, ToolDefinition>;

type AgentStudioMemoryTools = {
  algolia_ponder: MemoryTool;
  algolia_memorize: MemoryTool;
  algolia_memory_search: MemoryTool;
};

type SearchTools = {
  [K in `algolia_search_index_${string}`]: AlgoliaMCPSearchTool;
} & {
  algolia_search_index: AlgoliaMCPSearchTool;
  searchIndex: SearchIndexTool;
};
type CustomTools = {
  [K in string as K extends keyof SearchTools | `algolia_search_index_${string}`
    ? never
    : K]: CustomTool;
};
type Tools = AgentStudioMemoryTools & CustomTools & SearchTools;

type DataParts = {
  suggestions: {
    suggestions: string[];
  };
};

export type AIMessage = UIMessage<{ stopped?: boolean }, DataParts, Tools>;

export type AIMessagePart = UIMessagePart<DataParts, Tools>;

export type SearchToolPart = ToolUIPart<SearchTools>;
export type MemoryToolPart = ToolUIPart<AgentStudioMemoryTools>;
export type AIToolPart = ToolUIPart<Tools>;

export interface AggregatedToolCallPart {
  type: 'aggregated-tool-call';
  queries: string[];
}

export type SearchIndexOutputPart = ToolUIPart<{
  searchIndex: SearchIndexTool;
}>;
export type AlgoliaMCPSearchOutputPart = ToolUIPart<
  {
    [K in `algolia_search_index_${string}`]: AlgoliaMCPSearchTool;
  } & {
    algolia_search_index: AlgoliaMCPSearchTool;
  }
>;
export type SearchOutputPart =
  | AlgoliaMCPSearchOutputPart
  | SearchIndexOutputPart;

export interface PromptSuggestion {
  prompt: string;
}
