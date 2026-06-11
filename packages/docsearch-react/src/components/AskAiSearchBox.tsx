import type { UseChatHelpers } from '@ai-sdk/react';
import type { AutocompleteApi, AutocompleteState } from '@algolia/autocomplete-core';
import React, { type JSX, type RefObject } from 'react';

import { ConversationHistoryIcon, MoreVerticalIcon, NewConversationIcon, StopIcon, BackIcon } from '../icons';
import { Menu } from '../Menu';
import { ModalHeading } from '../ModalHeading';
import type { InternalDocSearchHit } from '../types';
import type { AIMessage, AskAiState } from '../types/AskiAi';
import { getCollection } from '../utils';

import { SearchBoxForm } from './ui/SearchBoxForm';

export type AskAiSearchBoxTranslations = Partial<{
  clearButtonTitle: string;
  clearButtonAriaLabel: string;
  closeButtonText: string;
  closeButtonAriaLabel: string;
  placeholderText: string;
  placeholderTextAskAi: string;
  placeholderTextAskAiStreaming: string;
  enterKeyHint: string;
  enterKeyHintAskAi: string;
  searchInputLabel: string;
  backToKeywordSearchButtonText: string;
  backToKeywordSearchButtonAriaLabel: string;
  newConversationPlaceholder: string;
  conversationHistoryTitle: string;
  startNewConversationText: string;
  viewConversationHistoryText: string;
  threadDepthErrorPlaceholder: string;
}>;

interface AskAiSearchBoxProps
  extends AutocompleteApi<InternalDocSearchHit, React.FormEvent, React.MouseEvent, React.KeyboardEvent> {
  state: AutocompleteState<InternalDocSearchHit>;
  autoFocus: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onClose: () => void;
  onAskAiToggle: (toggle: boolean) => void;
  onAskAgain: (query: string) => void;
  onStopAskAiStreaming: () => Promise<void>;
  placeholder: string;
  isAskAiActive: boolean;
  askAiStatus: UseChatHelpers<AIMessage>['status'];
  askAiError?: Error;
  isFromSelection: boolean;
  translations?: AskAiSearchBoxTranslations;
  askAiState: AskAiState;
  setAskAiState: (state: AskAiState) => void;
  onNewConversation: () => void;
  onViewConversationHistory: () => void;
  isThreadDepthError?: boolean;
}

export function AskAiSearchBox({
  translations = {},
  askAiState,
  onAskAiToggle,
  setAskAiState,
  ...props
}: AskAiSearchBoxProps): JSX.Element {
  const {
    clearButtonTitle = 'Clear',
    clearButtonAriaLabel = 'Clear the query',
    closeButtonText = 'Close',
    closeButtonAriaLabel = 'Close',
    searchInputLabel = 'Search',
    backToKeywordSearchButtonText = 'Back to keyword search',
    backToKeywordSearchButtonAriaLabel = 'Back to keyword search',
    placeholderTextAskAiStreaming = 'Answering...',
    newConversationPlaceholder = 'Ask a question',
    conversationHistoryTitle = 'My conversation history',
    startNewConversationText = 'Start a new conversation',
    viewConversationHistoryText = 'Conversation history',
    threadDepthErrorPlaceholder = 'Conversation limit reached',
  } = translations;

  const hasRecentConversations = React.useMemo(() => {
    const askAiSource = getCollection(props.state, 'recentConversations');

    if (!askAiSource) {
      return false;
    }

    return askAiSource.items.length > 0;
  }, [props.state]);

  const baseInputProps = props.getInputProps({
    inputElement: props.inputRef.current!,
    autoFocus: props.autoFocus,
  });
  const blockedKeys = new Set(['ArrowUp', 'ArrowDown', 'Enter']);
  const origOnKeyDown = baseInputProps.onKeyDown;
  const origOnChange = baseInputProps.onChange;
  const isAskAiStreaming = props.askAiStatus === 'streaming' || props.askAiStatus === 'submitted';
  const renderMoreOptions = props.isAskAiActive && askAiState !== 'conversation-history';

  // Use the thread depth error state passed from parent
  const isThreadDepthError = props.isThreadDepthError || false;
  let searchPlaceholder = props.placeholder;

  if (askAiState === 'new-conversation') {
    searchPlaceholder = newConversationPlaceholder;
  }

  // Override placeholder when thread depth error occurs (only in Ask AI mode)
  if (isThreadDepthError && props.isAskAiActive) {
    searchPlaceholder = threadDepthErrorPlaceholder;
  }

  let heading: string | null = null;

  if (isAskAiStreaming) {
    heading = placeholderTextAskAiStreaming;
  }

  if (askAiState === 'conversation-history') {
    heading = conversationHistoryTitle;
  }

  // when returning to another status than streaming or submitted, we focus on the input
  React.useEffect(() => {
    if (props.askAiStatus !== 'streaming' && props.askAiStatus !== 'submitted' && props.inputRef.current) {
      props.inputRef.current.focus();
    }
  }, [props.askAiStatus, props.inputRef]);

  /**
   * We need to block the default behavior of the input when Ask AI is active.
   * This is because the input is used to ask another question when the user presses enter.
   *
   * Learn more on default autocomplete behavior:
   * https://github.com/algolia/autocomplete/blob/next/packages/autocomplete-core/src/getDefaultProps.ts.
   */
  const inputProps = {
    enterKeyHint: props.isAskAiActive ? ('enter' as const) : ('search' as const),
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>): void => {
      let askAiHandled = false;
      // block these up, down, enter listeners when Ask AI is active
      if (props.isAskAiActive && blockedKeys.has(e.key)) {
        // enter key asks another question
        if (e.key === 'Enter' && !isAskAiStreaming && props.state.query) {
          props.onAskAgain(props.state.query);
        }

        askAiHandled = true;
      }

      if (askAiHandled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      origOnKeyDown?.(e);
    },
    onChange: (e: React.ChangeEvent<HTMLInputElement>): void => {
      if (props.isAskAiActive) {
        props.setQuery(e.currentTarget.value);
        // block search when Ask AI is active
        // we don't want to trigger the search when the user types
        // we already know they are asking a question
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      origOnChange?.(e);
    },
    disabled: isAskAiStreaming || (isThreadDepthError && props.isAskAiActive),
  };

  const handleAskAiBackClick = React.useCallback((): void => {
    // If there's a thread depth error, start a new conversation instead of exiting
    if (isThreadDepthError) {
      props.onNewConversation();
      return;
    }

    if (askAiState === 'conversation-history') {
      onAskAiToggle(true);
      setAskAiState('initial');
      return;
    }

    onAskAiToggle(false);
  }, [askAiState, isThreadDepthError, onAskAiToggle, setAskAiState, props]);

  const leadingElement = props.isAskAiActive ? (
    <button
      type="button"
      tabIndex={0}
      className="DocSearch-Action DocSearch-AskAi-Return"
      title={backToKeywordSearchButtonText}
      aria-label={backToKeywordSearchButtonAriaLabel}
      onClick={handleAskAiBackClick}
    >
      <BackIcon />
    </button>
  ) : undefined;
  const inputOverlay = heading ? <ModalHeading heading={heading} shimmer={isAskAiStreaming} /> : null;
  const actionsBeforeClose = (
    <>
      {isAskAiStreaming && (
        <>
          <button
            type="button"
            className="DocSearch-Action DocSearch-StopStreaming"
            onClick={props.onStopAskAiStreaming}
          >
            <StopIcon />
          </button>

          <div className="DocSearch-Divider" />
        </>
      )}

      {renderMoreOptions && (
        <>
          <Menu>
            <Menu.Trigger className="DocSearch-Action">
              <MoreVerticalIcon />
            </Menu.Trigger>
            <Menu.Content>
              <Menu.Item onClick={props.onNewConversation}>
                <NewConversationIcon />
                {startNewConversationText}
              </Menu.Item>
              {hasRecentConversations && (
                <Menu.Item onClick={props.onViewConversationHistory}>
                  <ConversationHistoryIcon />
                  {viewConversationHistoryText}
                </Menu.Item>
              )}
            </Menu.Content>
          </Menu>

          <div className="DocSearch-Divider" />
        </>
      )}
    </>
  );

  return (
    <SearchBoxForm
      {...props}
      placeholder={searchPlaceholder}
      clearButtonTitle={clearButtonTitle}
      clearButtonAriaLabel={clearButtonAriaLabel}
      closeButtonText={closeButtonText}
      closeButtonAriaLabel={closeButtonAriaLabel}
      searchInputLabel={searchInputLabel}
      leadingElement={leadingElement}
      inputOverlay={inputOverlay}
      hideInput={Boolean(heading)}
      actionsBeforeClose={actionsBeforeClose}
      inputProps={inputProps}
    />
  );
}
