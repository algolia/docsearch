import type { JSX } from 'react';
import React from 'react';

import type { Exchange } from '../AskAiScreen';
import {
  CloseIcon,
  ConversationHistoryIcon,
  EditIcon,
  ExpandIcon,
  FolderIcon,
  MoreVerticalIcon,
  NewConversationIcon,
  SparklesIcon,
} from '../icons';
import { BackIcon } from '../icons/BackIcon';
import { Menu } from '../Menu';
import { useIsMobile } from '../useIsMobile';

import type { SidepanelState } from './types';

type BackButtonProps = {
  mobile?: boolean;
  onBack: () => void;
  disabled?: boolean;
};

const BackButton = ({ onBack, mobile = false, disabled = false }: BackButtonProps): JSX.Element => {
  return (
    <button
      type="button"
      className={`DocSearch-Action DocSearch-Sidepanel-Action-back${mobile ? ' mobile' : ''}`}
      title="Go back to previous screen"
      aria-disabled={disabled}
      onClick={disabled ? undefined : onBack}
    >
      <BackIcon />
    </button>
  );
};

export type HeaderTranslations = Partial<{
  /**
   * The main title text shown on the header.
   **/
  title: string;
  /**
   * The title text shown on the conversation history screen.
   **/
  conversationHistoryTitle: string;
  /**
   * The text shown on the start a conversation button.
   **/
  newConversationText: string;
  /**
   * The text shown on the view conversation history button.
   **/
  viewConversationHistoryText: string;
}>;

type SidepanelHeaderProps = {
  sidepanelState: SidepanelState;
  exchanges: Exchange[];
  setSidepanelState: (state: SidepanelState) => void;
  onNewConversation: () => void;
  onToggleExpanded: () => void;
  onClose: () => void;
  translations?: HeaderTranslations;
  hasConversations: boolean;
  isStreaming: boolean;
};

export const SidepanelHeader = React.memo(
  ({
    sidepanelState,
    exchanges,
    setSidepanelState,
    onNewConversation,
    onToggleExpanded,
    onClose,
    translations = {},
    hasConversations,
    isStreaming,
  }: SidepanelHeaderProps): JSX.Element => {
    const {
      title = 'Ask AI',
      conversationHistoryTitle = 'My conversation history',
      newConversationText = 'Start a new conversation',
      viewConversationHistoryText = 'Conversation history',
    } = translations;

    const isMobile = useIsMobile();

    const goToConversationHistory = (): void => {
      setSidepanelState('conversation-history');
    };

    const onBack = React.useCallback((): void => {
      if (exchanges.length > 0) {
        setSidepanelState('conversation');
      } else {
        setSidepanelState('new-conversation');
      }
    }, [exchanges, setSidepanelState]);

    const newConversationDisabled = sidepanelState === 'new-conversation' && exchanges.length < 1;

    let header = title;

    if (sidepanelState === 'conversation-history') {
      header = conversationHistoryTitle;
    }

    if (isMobile) {
      header = title;
    }

    return (
      <header className="DocSearch-Sidepanel-Header">
        <div className="DocSearch-Sidepanel-Header--left">
          <BackButton mobile={true} disabled={isStreaming} onBack={onBack} />

          {sidepanelState === 'conversation-history' && <div className="DocSearch-Divider" />}

          <button type="button" className="DocSearch-Action" title={newConversationText} onClick={onNewConversation}>
            <EditIcon />
          </button>

          <div className="DocSearch-Divider" />

          <button
            type="button"
            className="DocSearch-Action"
            title={viewConversationHistoryText}
            onClick={goToConversationHistory}
          >
            <FolderIcon />
          </button>
        </div>
        <div className="DocSearch-Sidepanel-Header--center">
          <BackButton disabled={isStreaming} onBack={onBack} />
          <SparklesIcon className="DocSearch-Sidepanel-Header-TitleIcon" />
          <h2 className="DocSearch-Sidepanel-Title">{header}</h2>
        </div>
        <div className="DocSearch-Sidepanel-Header--right">
          {sidepanelState !== 'conversation-history' && (!newConversationDisabled || hasConversations) && (
            <Menu>
              <Menu.Trigger className="DocSearch-Action DocSearch-Sidepanel-Action-menu" disabled={isStreaming}>
                <MoreVerticalIcon />
              </Menu.Trigger>
              <Menu.Content>
                {!newConversationDisabled && (
                  <Menu.Item onClick={onNewConversation}>
                    <NewConversationIcon />
                    {newConversationText}
                  </Menu.Item>
                )}
                {hasConversations && (
                  <Menu.Item onClick={goToConversationHistory}>
                    <ConversationHistoryIcon />
                    {viewConversationHistoryText}
                  </Menu.Item>
                )}
              </Menu.Content>
            </Menu>
          )}
          <button
            type="button"
            className="DocSearch-Action DocSearch-Sidepanel-Action-expand"
            title="Expand or collapse Sidepanel"
            onClick={onToggleExpanded}
          >
            <ExpandIcon />
          </button>
          <button
            type="button"
            className="DocSearch-Action DocSearch-Sidepanel-Action-close"
            title="Close Sidepanel"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>
      </header>
    );
  },
);
