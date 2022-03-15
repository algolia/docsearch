import React from 'react';

import { NoResultsIcon } from './icons';
import type { ScreenStateProps } from './ScreenState';
import type { InternalDocSearchHit } from './types';

export type NoResultsScreenTranslations = Partial<{
  noResultsText: string;
  suggestedQueryText: string;
  reportMissingResultsText: string;
  reportMissingResultsLinkText: string;
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
    reportMissingResultsText = 'Believe this query should return results?',
    reportMissingResultsLinkText = 'Let us know.',
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

      {props.getMissingResultsUrl && (
        <p className="DocSearch-Help">
          {`${reportMissingResultsText} `}
          <a
            href={props.getMissingResultsUrl({ query: props.state.query })}
            target="_blank"
            rel="noopener noreferrer"
          >
            {reportMissingResultsLinkText}
          </a>
        </p>
      )}
    </div>
  );
}
