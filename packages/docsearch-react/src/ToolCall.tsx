/* eslint-disable react/no-array-index-key */
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

interface QueryResult {
  query: string;
  numberOfResults?: number;
}

function getSearchQueries(part: AIToolPart): QueryResult[] {
  if (part.state !== 'input-available' && part.state !== 'output-available') {
    return [];
  }

  if (part.type === 'tool-searchIndex') {
    const query = (part.output?.query ?? part.input.query ?? '').trim();
    const numberOfResults = part.state === 'output-available' ? (part.output.hits ?? []).length : undefined;
    return query ? [{ query, numberOfResults }] : [];
  }

  if ('queries' in part.input && Array.isArray(part.input.queries)) {
    return part.input.queries.filter(({ query }) => query.trim()).map(({ query }) => ({ query: query.trim() }));
  }

  if ('query' in part.input && typeof part.input.query === 'string') {
    const query = part.input.query.trim();
    const numberOfResults = part.output ? (part.output.nbHits ?? (part.output.hits ?? []).length) : undefined;

    return query ? [{ query, numberOfResults }] : [];
  }

  return [];
}

export function ToolCall({ part, translations, onSearchQueryClick }: ToolCallProps): JSX.Element | null {
  const { searchingText, preToolCallText, toolCallResultText } = translations;

  const queries = getSearchQueries(part);

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
        <>
          {queries.map(({ query }, index) => (
            <div key={index} className="DocSearch-AskAiScreen-MessageContent-Tool Tool--Call shimmer">
              <LoadingIcon className="DocSearch-AskAiScreen-SmallerLoadingIcon" />
              <span>
                {preToolCallText} {`"${query || ''}" ...`}
              </span>
            </div>
          ))}
        </>
      );
    case 'output-available': {
      return (
        <>
          {queries.map(({ query, numberOfResults }, index) => {
            return (
              <div key={index} className="DocSearch-AskAiScreen-MessageContent-Tool Tool--Result">
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
                          onSearchQueryClick(query);
                        }
                      }}
                      onClick={() => onSearchQueryClick(query)}
                    >
                      {' '}
                      &quot;{query}&quot;
                    </span>
                  ) : (
                    <span className="DocSearch-AskAiScreen-MessageContent-Tool-Query"> &quot;{query}&quot;</span>
                  )}{' '}
                  {typeof numberOfResults !== 'undefined' && `found ${numberOfResults} results`}
                </span>
              </div>
            );
          })}
        </>
      );
    }
    default:
      return null;
  }
}
