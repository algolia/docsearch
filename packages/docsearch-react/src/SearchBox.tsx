import type { UseChatHelpers } from '@ai-sdk/react';
import type { AutocompleteApi, AutocompleteState } from '@algolia/autocomplete-core';
import React, { type JSX, type RefObject } from 'react';

import { MAX_QUERY_SIZE } from './constants';
import {
  LoadingIcon,
  CloseIcon,
  SearchIcon,
  StopIcon,
  MoreVerticalIcon,
  NewConversationIcon,
  ConversationHistoryIcon,
} from './icons';
import { BackIcon } from './icons/BackIcon';
import { Menu } from './Menu';
import { ModalHeading } from './ModalHeading';
import type { InternalDocSearchHit } from './types';
import type { AIMessage, AskAiState } from './types/AskiAi';

export type SearchBoxTranslations = Partial<{
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
}>;

type AskAiEnabledProps = {
  // `boolean | true` used here since the props is a toggle
  isAskAiActive: boolean | true;
  onAskAiToggle: (toggle: boolean) => void;
  onAskAgain: (query: string) => void;
  onStopAskAiStreaming: () => Promise<void>;
  askAiState: AskAiState;
  setAskAiState: (state: AskAiState) => void;
  onNewConversation: () => void;
  onViewConversationHistory: () => void;
  askAiStatus: UseChatHelpers<AIMessage>['status'];
};

type SearchOnlyProps = {
  isAskAiActive: false;
  onAskAiToggle?: undefined;
  onAskAgain?: undefined;
  onStopAskAiStreaming?: undefined;
  askAiState?: undefined;
  setAskAiState?: undefined;
  onNewConversation?: undefined;
  onViewConversationHistory?: undefined;
  askAiStatus?: undefined;
};

type SearchBoxProps = AutocompleteApi<InternalDocSearchHit, React.FormEvent, React.MouseEvent, React.KeyboardEvent> & {
  state: AutocompleteState<InternalDocSearchHit>;
  autoFocus: boolean;
  inputRef: RefObject<HTMLInputElement | null>;
  onClose: () => void;
  placeholder: string;
  translations?: SearchBoxTranslations;
  isFromSelection: boolean;
} & (AskAiEnabledProps | SearchOnlyProps);

export function SearchBox({ translations = {}, ...props }: SearchBoxProps): JSX.Element {
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
  } = translations;
  const { onReset } = props.getFormProps({
    inputElement: props.inputRef.current,
  });

  React.useEffect(() => {
    if (props.autoFocus && props.inputRef.current) {
      props.inputRef.current.focus();
    }
  }, [props.autoFocus, props.inputRef]);

  React.useEffect(() => {
    if (props.isFromSelection && props.inputRef.current) {
      props.inputRef.current.select();
    }
  }, [props.isFromSelection, props.inputRef]);

  const hasRecentConversations = React.useMemo(() => {
    const askAiSource = props.state.collections[2];

    if (!askAiSource) {
      return false;
    }

    return askAiSource.items.length > 0;
  }, [props.state.collections]);

  const baseInputProps = props.getInputProps({
    inputElement: props.inputRef.current!,
    autoFocus: props.autoFocus,
    maxLength: MAX_QUERY_SIZE,
  });

  const blockedKeys = new Set(['ArrowUp', 'ArrowDown', 'Enter']);
  const origOnKeyDown = baseInputProps.onKeyDown;
  const origOnChange = baseInputProps.onChange;
  const isAskAiStreaming =
    props.isAskAiActive && (props.askAiStatus === 'streaming' || props.askAiStatus === 'submitted');
  const isKeywordSearchLoading = props.state.status === 'stalled';
  const renderMoreOptions = props.isAskAiActive && props.askAiState !== 'conversation-history';
  let searchPlaceholder = props.placeholder;

  if (props.isAskAiActive && props.askAiState === 'new-conversation') {
    searchPlaceholder = newConversationPlaceholder;
  }

  let heading: string | null = null;

  if (isAskAiStreaming) {
    heading = placeholderTextAskAiStreaming;
  }

  if (props.isAskAiActive && props.askAiState === 'conversation-history') {
    heading = conversationHistoryTitle;
  }

  // when returning to another status than streaming or submitted, we focus on the input
  React.useEffect(() => {
    if (
      props.isAskAiActive &&
      props.askAiStatus !== 'streaming' &&
      props.askAiStatus !== 'submitted' &&
      props.inputRef.current
    ) {
      props.inputRef.current.focus();
    }
  }, [props.isAskAiActive, props.askAiStatus, props.inputRef]);

  /**
   * We need to block the default behavior of the input when Ask AI is active.
   * This is because the input is used to ask another question when the user presses enter.
   *
   * Learn more on default autocomplete behavior:
   * https://github.com/algolia/autocomplete/blob/next/packages/autocomplete-core/src/getDefaultProps.ts.
   */
  const inputProps = {
    ...baseInputProps,
    enterKeyHint: props.isAskAiActive ? ('enter' as const) : ('search' as const),
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>): void => {
      // block these up, down, enter listeners when Ask AI is active
      if (props.isAskAiActive && blockedKeys.has(e.key)) {
        // enter key asks another question
        if (e.key === 'Enter' && !isAskAiStreaming && props.state.query) {
          props.onAskAgain(props.state.query);
        }
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
    disabled: isAskAiStreaming,
  };

  const handleAskAiBackClick = React.useCallback((): void => {
    if (!props.isAskAiActive) return;

    if (props.askAiState === 'conversation-history') {
      props.onAskAiToggle(true);
      props.setAskAiState('initial');
      return;
    }

    props.onAskAiToggle(false);
  }, [props]);

  return (
    <>
      <form
        className="DocSearch-Form"
        onSubmit={(event) => {
          event.preventDefault();
        }}
        onReset={onReset}
      >
        {props.isAskAiActive ? (
          <>
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
          </>
        ) : (
          <>
            {isKeywordSearchLoading && (
              <div className="DocSearch-LoadingIndicator">
                <LoadingIcon />
              </div>
            )}
            {!isKeywordSearchLoading && (
              <label className="DocSearch-MagnifierLabel" {...props.getLabelProps()}>
                <SearchIcon />
                <span className="DocSearch-VisuallyHiddenForAccessibility">{searchInputLabel}</span>
              </label>
            )}
          </>
        )}

        {heading && <ModalHeading heading={heading} shimmer={isAskAiStreaming} />}

        <input
          className="DocSearch-Input"
          ref={props.inputRef}
          {...inputProps}
          placeholder={searchPlaceholder}
          hidden={Boolean(heading)}
        />

        <div className="DocSearch-Actions">
          <button
            className="DocSearch-Clear"
            type="reset"
            aria-label={clearButtonAriaLabel}
            hidden={!props.state.query}
            tabIndex={props.state.query ? 0 : -1}
            aria-hidden={!props.state.query ? 'true' : 'false'}
          >
            {clearButtonTitle}
          </button>

          {props.state.query && <div className="DocSearch-Divider" />}

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

          <button
            type="button"
            title={closeButtonText}
            className="DocSearch-Action DocSearch-Close"
            aria-label={closeButtonAriaLabel}
            onClick={props.onClose}
          >
            <CloseIcon />
          </button>
        </div>
      </form>
    </>
  );
}
