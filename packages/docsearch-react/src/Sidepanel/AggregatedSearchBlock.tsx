import React, { Fragment } from 'react';
import type { JSX } from 'react';

import { SearchIcon } from '../icons';

type AggregatedSearchBlockProps = {
  queries: string[];
};

const before = 'Searched for ';
const separator = ', ';
const lastSeparator = ' and ';
const after = '';

export function AggregatedSearchBlock({ queries }: AggregatedSearchBlockProps): JSX.Element {
  return (
    <div className="DocSearch-AskAiScreen-MessageContent-Tool Tool--AggregatedResult">
      <SearchIcon size={18} />
      <span>
        {before && <span>{before}</span>}
        {queries.map((q, idx) => (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={q + idx}>
            <span className="DocSearch-AskAiScreen-MessageContent-Tool-Query">&quot;{q}&quot;</span>
            {idx < queries.length - 2 && separator}
            {idx === queries.length - 2 && lastSeparator}
          </Fragment>
        ))}
        {after && <span>{after}</span>}
      </span>
    </div>
  );
}
