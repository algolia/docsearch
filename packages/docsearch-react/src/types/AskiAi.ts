import type { UIMessage } from '@ai-sdk/react';
import type { UIDataTypes, UIMessagePart } from 'ai';

export interface SearchIndexTool {
  input: string;
  output: {
    query: string;
  };
}

export type AIMessage = UIMessage<
  unknown,
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
