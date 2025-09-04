import type { UIMessage } from '@ai-sdk/react';
import type { UIDataTypes } from 'ai';

export type AIMessage = UIMessage<
  unknown,
  UIDataTypes,
  {
    searchIndex: {
      input: string;
      output: {
        args: {
          query: string;
        };
      };
    };
  }
>;
