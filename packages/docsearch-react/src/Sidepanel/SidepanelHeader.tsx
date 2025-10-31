import type { JSX } from 'react';
import React from 'react';

import type { Exchange } from '../AskAiScreen';
import {
  CloseIcon,
  ConversationHistoryIcon,
  ExpandIcon,
  MoreVerticalIcon,
  NewConversationIcon,
  SparklesIcon,
} from '../icons';
import { BackIcon } from '../icons/BackIcon';
import { Menu } from '../Menu';

type SidepanelState = 'conversation-history' | 'conversation' | 'new-conversation';

type SidepanelHeaderProps = {
  sidepanelState: SidepanelState;
  exchanges: Exchange[];
  setSidepanelState: (state: SidepanelState) => void;
  onNewConversation: () => void;
  onToggleExpanded: () => void;
  onClose: () => void;
};

export const SidepanelHeader = React.memo(
  ({
    sidepanelState,
    exchanges,
    setSidepanelState,
    onNewConversation,
    onToggleExpanded,
    onClose,
  }: SidepanelHeaderProps): JSX.Element => {
    let header = 'Ask AI';

    if (sidepanelState === 'conversation-history') {
      header = 'My conversation history';
    }

    return (
      <header className="DocSearch-Sidepanel-Header">
        <div className="DocSearch-Sidepanel-Header--left">
          {sidepanelState === 'conversation-history' ? (
            <button
              type="button"
              className="DocSearch-AskAi-Return"
              onClick={() => {
                if (exchanges.length > 0) {
                  setSidepanelState('conversation');
                } else {
                  setSidepanelState('new-conversation');
                }
              }}
            >
              <BackIcon />
            </button>
          ) : (
            <SparklesIcon />
          )}
          <h2 className="DocSearch-Sidepanel-Title">{header}</h2>
        </div>
        <div className="DocSearch-Sidepanel-Header--right">
          {sidepanelState !== 'conversation-history' && (
            <Menu>
              <Menu.Trigger className="DocSearch-Action">
                <MoreVerticalIcon />
              </Menu.Trigger>
              <Menu.Content>
                {sidepanelState !== 'new-conversation' && (
                  <Menu.Item onClick={onNewConversation}>
                    <NewConversationIcon />
                    Start a new conversation
                  </Menu.Item>
                )}
                <Menu.Item
                  onClick={() => {
                    setSidepanelState('conversation-history');
                  }}
                >
                  <ConversationHistoryIcon />
                  Conversation history
                </Menu.Item>
              </Menu.Content>
            </Menu>
          )}
          <button type="button" className="DocSearch-Action" onClick={onToggleExpanded}>
            <ExpandIcon />
          </button>
          <button type="button" className="DocSearch-Action" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
      </header>
    );
  },
);
