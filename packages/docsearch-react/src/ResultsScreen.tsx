import React, { type JSX } from 'react';

import { HitResultBadge } from './components/HitResultBadge';
import { SelectIcon, SourceIcon } from './icons';
import type { ResultsTranslations } from './Results';
import { Results } from './Results';
import type { ScreenStateProps } from './ScreenState';
import type { InternalDocSearchHit } from './types';

export type ResultsScreenTranslations = Partial<{
  askAiPlaceholder: string;
  noResultsAskAiPlaceholder: string;
  resultsSectionTitle: string;
}> &
  ResultsTranslations;

type ResultsScreenProps = Omit<ScreenStateProps<InternalDocSearchHit>, 'translations'> & {
  translations?: ResultsScreenTranslations;
};

export function ResultsScreen({ translations = {}, resultBadgeKey, ...props }: ResultsScreenProps): JSX.Element {
  const { resultsSectionTitle = 'Results' } = translations;

  const renderIcon = React.useCallback(({ item }: { item: InternalDocSearchHit }) => {
    return (
      <div className="DocSearch-Hit-icon">
        <SourceIcon type={item.type} />
      </div>
    );
  }, []);

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
    [resultBadgeKey, translations.resultBadgeLabelText],
  );

  return (
    <div className="DocSearch-Dropdown-Container">
      {props.state.collections.map((collection) => {
        if (collection.items.length === 0) {
          return null;
        }

        return (
          <Results
            {...props}
            key={collection.source.sourceId}
            translations={translations}
            title={resultsSectionTitle}
            collection={collection}
            renderIcon={renderIcon}
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
