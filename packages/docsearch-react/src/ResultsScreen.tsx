import React, { type JSX } from 'react';

import { SelectIcon, SourceIcon } from './icons';
import { Results } from './Results';
import type { ScreenStateProps } from './ScreenState';
import type { InternalDocSearchHit } from './types';

export type ResultsScreenTranslations = Partial<{
  askAiPlaceholder: string;
  noResultsAskAiPlaceholder: string;
  resultsSectionTitle: string;
}>;

type ResultsScreenProps = Omit<ScreenStateProps<InternalDocSearchHit>, 'translations'> & {
  translations?: ResultsScreenTranslations;
};

export function ResultsScreen({ translations = {}, ...props }: ResultsScreenProps): JSX.Element {
  const { resultsSectionTitle = 'Results' } = translations;

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
            renderIcon={({ item }) => (
              <div className="DocSearch-Hit-icon">
                <SourceIcon type={item.type} />
              </div>
            )}
            renderAction={() => (
              <div className="DocSearch-Hit-action">
                <SelectIcon />
              </div>
            )}
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
