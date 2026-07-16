import React, { type JSX } from 'react';

import type { AskAiScreenStateProps } from '../../AskAiScreenState';
import { CloseIcon, MessageIcon } from '../../icons';
import { Results } from '../../Results';
import type { InternalDocSearchHit } from '../../types';
import { getCollection } from '../../utils';

export type RecentConversationsResultsTranslations = Partial<{
  recentConversationsTitle: string;
  removeRecentConversationButtonTitle: string;
}>;

type RecentConversationsResultsProps = Omit<
  AskAiScreenStateProps<InternalDocSearchHit>,
  'translations'
> & {
  translations?: RecentConversationsResultsTranslations;
};

export function RecentConversationsResults({
  translations = {},
  ...props
}: RecentConversationsResultsProps): JSX.Element | null {
  const {
    recentConversationsTitle = 'Resume AI conversations',
    removeRecentConversationButtonTitle = 'Remove this conversation from history',
  } = translations;
  const recentConversations = getCollection(props.state, 'recentConversations');

  if (!recentConversations) {
    return null;
  }

  return (
    <Results
      {...props}
      title={recentConversationsTitle}
      collection={recentConversations}
      renderIcon={() => (
        <div className="DocSearch-Hit-icon DocSearch-Hit-icon--small">
          <MessageIcon />
        </div>
      )}
      renderAction={({ item }) => (
        <div className="DocSearch-Hit-action">
          <button
            className="DocSearch-Hit-action-button"
            title={removeRecentConversationButtonTitle}
            type="submit"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              props.conversations.remove(item);
              props.refresh();
            }}
          >
            <CloseIcon />
          </button>
        </div>
      )}
    />
  );
}
