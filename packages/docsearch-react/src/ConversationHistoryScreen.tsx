import type { JSX } from 'react';
import React from 'react';

import type { AskAiScreenStateProps } from './AskAiScreenState';
import { CloseIcon, SparklesIcon } from './icons';
import { Results } from './Results';
import type { ResultsScreenTranslations } from './ResultsScreen';
import type { InternalDocSearchHit } from './types';
import { getCollection } from './utils';

type ConversationHistoryScreenProps = Omit<AskAiScreenStateProps<InternalDocSearchHit>, 'translations'> & {
  translations?: ResultsScreenTranslations;
};

export function ConversationHistoryScreen({
  onAskAiToggle,
  ...props
}: ConversationHistoryScreenProps): JSX.Element | null {
  const collection = React.useMemo(() => getCollection(props.state, 'recentConversations'), [props.state]);

  React.useEffect(() => {
    if (!collection || collection.items.length === 0) {
      onAskAiToggle(true);
    }
  }, [collection, onAskAiToggle]);

  if (!collection) {
    return null;
  }

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
