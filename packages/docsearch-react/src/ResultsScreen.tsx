import React, { type JSX } from 'react';

import { HitResultBadge } from './components/HitResultBadge';
import { SelectIcon, SourceIcon } from './icons';
import type { ResultsTranslations } from './Results';
import { Results } from './Results';
import type { ScreenStateProps } from './ScreenState';
import type { InternalDocSearchHit } from './types';
import { removeHighlightTags } from './utils';

export type ResultsScreenTranslations = Partial<{
  askAiPlaceholder: string;
  noResultsAskAiPlaceholder: string;
  resultsSectionTitle: string;
  askAiResultsTitle: string;
}> &
  ResultsTranslations;

type ResultsScreenProps = Omit<
  ScreenStateProps<InternalDocSearchHit>,
  'translations'
> & {
  translations?: ResultsScreenTranslations;
};

export function ResultsScreen({
  translations = {},
  resultBadgeKey,
  ...props
}: ResultsScreenProps): JSX.Element {
  const renderAction = React.useCallback(() => {
    return (
      <div className="DocSearch-Hit-action">
        <SelectIcon />
      </div>
    );
  }, []);

  const renderResultBadge = React.useCallback(
    ({ item }: { item: InternalDocSearchHit }) => {
      return (
        <HitResultBadge
          item={item}
          resultBadgeKey={resultBadgeKey}
          translations={{
            resultBadgeLabelText: translations.resultBadgeLabelText,
          }}
        />
      );
    },
    [resultBadgeKey, translations.resultBadgeLabelText]
  );

  return (
    <div className="DocSearch-Dropdown-Container">
      {props.state.collections.map((collection) => {
        if (collection.items.length === 0) {
          return null;
        }

        const title = removeHighlightTags(collection.items[0]);

        return (
          <Results
            {...props}
            key={collection.source.sourceId}
            translations={translations}
            title={title}
            collection={collection}
            renderIcon={({ item, index }) => (
              <>
                {item.__docsearch_parent && (
                  <svg className="DocSearch-Hit-Tree" viewBox="0 0 24 54">
                    <g
                      stroke="currentColor"
                      fill="none"
                      fillRule="evenodd"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {item.__docsearch_parent !==
                      collection.items[index + 1]?.__docsearch_parent ? (
                        <path d="M8 6v21M20 27H8.3" />
                      ) : (
                        <path d="M8 6v42M20 27H8.3" />
                      )}
                    </g>
                  </svg>
                )}
                <div className="DocSearch-Hit-icon">
                  <SourceIcon type={item.type} />
                </div>
              </>
            )}
            renderAction={renderAction}
            renderResultBadge={renderResultBadge}
          />
        );
      })}

      {props.resultsFooterComponent && (
        <section className="DocSearch-HitsFooter">
          <props.resultsFooterComponent state={props.state} />
        </section>
      )}
    </div>
  );
}
