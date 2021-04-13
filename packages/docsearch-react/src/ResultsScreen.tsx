import React from 'react';

import { SelectIcon, SourceIcon } from './icons';
import { Results } from './Results';
import { ScreenStateProps } from './ScreenState';
import { InternalDocSearchHit } from './types';
import { removeHighlightTags } from './utils';

type ResultsScreenProps = ScreenStateProps<InternalDocSearchHit>;

export function ResultsScreen(props: ResultsScreenProps) {
  return (
    <div className="DocSearch-Dropdown-Container">
      {props.state.collections.map((collection, index) => {
        if (collection.items.length === 0) {
          return null;
        }

        const title = removeHighlightTags(collection.items[0]);

        return (
          <Results
            {...props}
            key={index}
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
