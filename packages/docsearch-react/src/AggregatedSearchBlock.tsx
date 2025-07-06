import React, { type JSX, Fragment } from 'react';

import type { AskAiScreenTranslations } from './AskAiScreen';
import { SearchIcon } from './icons';

interface AggregatedSearchBlockProps {
  queries: string[];
  translations: AskAiScreenTranslations;
  onSearchQueryClick: (query: string) => void;
}

// allow translators to return either simple string parts or a fully custom node
export interface AggregatedToolCallParts {
  before?: string;
  separator?: string;
  lastSeparator?: string;
  after?: string;
}

// default english implementation ("Searched for \"A\", \"B\" and \"C\"")
const defaultAggregatedToolCallParts: AggregatedToolCallParts = {
  before: 'Searched for ',
  separator: ', ',
  lastSeparator: ' and ',
  after: '',
};

export function AggregatedSearchBlock({
  queries,
  translations,
  onSearchQueryClick,
}: AggregatedSearchBlockProps): JSX.Element | null {
  // no queries? no render
  if (queries.length === 0) return null;

  // if the translator provides a fully custom node, render it and bail out.
  if (typeof translations.aggregatedToolCallNode === 'function') {
    return <>{translations.aggregatedToolCallNode(queries, onSearchQueryClick)}</>;
  }

  // otherwise fall back to the classic english-pattern renderer.
  const parts = translations.aggregatedToolCallText
    ? translations.aggregatedToolCallText(queries)
    : defaultAggregatedToolCallParts;

  const { before = '', separator = ', ', lastSeparator = ' and ', after = '' } = parts || {};

  return (
    <div className="DocSearch-AskAiScreen-MessageContent-Tool Tool--AggregatedResult">
      <SearchIcon size={18} />
      <span>
        {before && <span>{before}</span>}
        {queries.map((q, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={q + idx}>
            <span
              role="button"
              tabIndex={0}
              className="DocSearch-AskAiScreen-MessageContent-Tool-Query"
              onKeyDown={(e) => {
                if (e.key === 'enter' || e.key === ' ') {
                  e.preventDefault();
                  onSearchQueryClick(q);
                }
              }}
              onClick={() => onSearchQueryClick(q)}
            >
              &quot;{q}&quot;
            </span>
            {idx < queries.length - 2 && separator}
            {idx === queries.length - 2 && lastSeparator}
          </Fragment>
        ))}
        {after && <span>{after}</span>}
      </span>
    </div>
  );
}
