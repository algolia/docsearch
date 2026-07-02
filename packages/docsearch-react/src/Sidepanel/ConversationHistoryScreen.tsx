/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import React from 'react';
import type { JSX } from 'react';

import { CloseIcon, RecentIcon } from '../icons';
import type { StoredSearchPlugin } from '../stored-searches';
import type { StoredAskAiState } from '../types';

type ConversationHistoryScreenProps = {
  conversations: StoredSearchPlugin<StoredAskAiState>;
  selectConversation: (conversation: StoredAskAiState) => void;
};

export const ConversationHistoryScreen = ({
  conversations,
  selectConversation,
}: ConversationHistoryScreenProps): JSX.Element => {
  const [items, setItems] = React.useState(() => conversations.getAll());

  const handleRemoveConversation = (item: StoredAskAiState): void => {
    conversations.remove(item);
    setItems(conversations.getAll());
  };

  return (
    <div className="DocSearch-Sidepanel-ConversationHistoryScreen">
      <ul>
        {items.map((item) => (
          <li key={item.objectID} className="DocSearch-Sidepanel-RecentConversation">
            <a
              href={item.url}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                selectConversation(item);
              }}
            >
              <div className="DocSearch-Sidepanel-RecentConversation-container">
                <div className="DocSearch-Sidepanel-RecentConversation-icon">
                  <RecentIcon />
                </div>

                <div className="DocSearch-Sidepanel-RecentConversation-content">
                  <span className="DocSearch-Sidepanel-RecentConversation-title">{item.hierarchy.lvl1}</span>
                </div>

                <div className="DocSearch-Hit-action">
                  <button
                    className="DocSearch-Hit-action-button"
                    type="button"
                    title="Remove conversation from history"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveConversation(item);
                    }}
                  >
                    <CloseIcon />
                  </button>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
