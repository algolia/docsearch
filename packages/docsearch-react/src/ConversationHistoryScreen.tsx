import type { JSX } from 'react';
import React from 'react';

import { CloseIcon, SparklesIcon } from './icons';
import { Results } from './Results';
import type { ResultsScreenTranslations } from './ResultsScreen';
import type { ScreenStateProps } from './ScreenState';
import type { InternalDocSearchHit } from './types';

type ConversationHistoryScreenProps = Omit<ScreenStateProps<InternalDocSearchHit>, 'translations'> & {
  translations?: ResultsScreenTranslations;
};

export function ConversationHistoryScreen({ onAskAiToggle, ...props }: ConversationHistoryScreenProps): JSX.Element {
  const collection = React.useMemo(() => props.state.collections[2], [props.state]);

  React.useEffect(() => {
    if (!collection || collection.items.length === 0) {
      onAskAiToggle(true);
    }
  }, [collection, onAskAiToggle]);

  return (
    <div className="DocSearch-Dropdown-Container DocSearch-Conversation-History">
      <Results
        {...props}
        key={collection.source.sourceId}
        title=""
        translations={props.translations}
        collection={collection}
        renderIcon={() => (
          <div className="DocSearch-Hit-icon">
            <SparklesIcon />
          </div>
        )}
        renderAction={({ item }) => (
          <div className="DocSearch-Hit-action">
            <button
              type="button"
              className="DocSearch-Hit-action-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                props.conversations.remove(item);
                props.refresh();
              }}
            >
              <CloseIcon />
            </button>
          </div>
        )}
      />
    </div>
  );
}
