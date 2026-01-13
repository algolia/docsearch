import type { JSX } from 'react';
import React from 'react';

import { LoadingIcon, SearchIcon } from './icons';
import type { AIToolPart } from './types/AskiAi';

export type ToolCallTranslations = {
  /**
   * Text shown while assistant is preparing tool call.
   */
  preToolCallText: string;
  /**
   * Text shown while assistant is performing search tool call.
   */
  searchingText: string;
  /**
   * Text shown while assistant is finished performing tool call.
   */
  toolCallResultText: string;
};

interface ToolCallProps {
  part: AIToolPart;
  translations: ToolCallTranslations;
  onSearchQueryClick?: (query: string) => void;
}

export function ToolCall({ part, translations, onSearchQueryClick }: ToolCallProps): JSX.Element | null {
  const { searchingText, preToolCallText, toolCallResultText } = translations;

  switch (part.state) {
    case 'input-streaming':
      return (
        <div className="DocSearch-AskAiScreen-MessageContent-Tool Tool--PartialCall shimmer">
          <LoadingIcon className="DocSearch-AskAiScreen-SmallerLoadingIcon" />
          <span>{searchingText}</span>
        </div>
      );
    case 'input-available':
      return (
        <div className="DocSearch-AskAiScreen-MessageContent-Tool Tool--Call shimmer">
          <LoadingIcon className="DocSearch-AskAiScreen-SmallerLoadingIcon" />
          <span>
            {preToolCallText} {`"${part.input.query || ''}" ...`}
          </span>
        </div>
      );
    case 'output-available': {
      const query = part.type === 'tool-searchIndex' ? part.output.query : part.input.query;
      const numberOfHits = part.type === 'tool-searchIndex' ? part.output.hits?.length : part.output.nbHits;

      return (
        <div className="DocSearch-AskAiScreen-MessageContent-Tool Tool--Result">
          <SearchIcon />
          <span>
            {toolCallResultText}{' '}
            {onSearchQueryClick ? (
              <span
                role="button"
                tabIndex={0}
                className="DocSearch-AskAiScreen-MessageContent-Tool-Query"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSearchQueryClick(query || '');
                  }
                }}
                onClick={() => onSearchQueryClick(query || '')}
              >
                {' '}
                &quot;{query || ''}&quot;
              </span>
            ) : (
              <span className="DocSearch-AskAiScreen-MessageContent-Tool-Query"> &quot;{query || ''}&quot;</span>
            )}{' '}
            found {numberOfHits || 0} results
          </span>
        </div>
      );
    }
    default:
      return null;
  }
}
