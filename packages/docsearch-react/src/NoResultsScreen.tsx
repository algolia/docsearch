import React from 'react';

import { NoResultsIcon } from './icons';
import type { ScreenStateProps } from './ScreenState';
import type { InternalDocSearchHit } from './types';

export type NoResultsScreenTranslations = Partial<{
  noResultsText: string;
  suggestedQueryText: string;
  openIssueText: string;
  openIssueLinkText: string;
}>;

type NoResultsScreenProps = Omit<
  ScreenStateProps<InternalDocSearchHit>,
  'translations'
> & {
  translations?: NoResultsScreenTranslations;
};

export function NoResultsScreen({
  translations = {},
  ...props
}: NoResultsScreenProps) {
  const {
    noResultsText = 'No results for',
    suggestedQueryText = 'Try searching for',
    openIssueText = 'Believe this query should return results?',
    openIssueLinkText = 'Let us know',
  } = translations;
  const searchSuggestions: string[] | undefined = props.state.context
    .searchSuggestions as string[];

  return (
    <div className="DocSearch-NoResults">
      <div className="DocSearch-Screen-Icon">
        <NoResultsIcon />
      </div>
      <p className="DocSearch-Title">
        {noResultsText} "<strong>{props.state.query}</strong>"
      </p>

      {searchSuggestions && searchSuggestions.length > 0 && (
        <div className="DocSearch-NoResults-Prefill-List">
          <p className="DocSearch-Help">{suggestedQueryText}:</p>
          <ul>
            {searchSuggestions.slice(0, 3).reduce<React.ReactNode[]>(
              (acc, search) => [
                ...acc,
                <li key={search}>
                  <button
                    className="DocSearch-Prefill"
                    key={search}
                    type="button"
                    onClick={() => {
                      props.setQuery(search.toLowerCase() + ' ');
                      props.refresh();
                      props.inputRef.current!.focus();
                    }}
                  >
                    {search}
                  </button>
                </li>,
              ],
              []
            )}
          </ul>
        </div>
      )}

      <p className="DocSearch-Help">
        {`${openIssueText} `}
        <a
          href={`https://github.com/algolia/docsearch-configs/issues/new?template=Missing_results.md&title=[${props.indexName}]+Missing+results+for+query+"${props.state.query}"`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {openIssueLinkText}
        </a>
        .
      </p>
    </div>
  );
}
