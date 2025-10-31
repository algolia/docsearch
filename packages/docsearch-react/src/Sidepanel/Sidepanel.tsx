import type { SidepanelShortcuts } from '@docsearch/core';
import React, { useCallback } from 'react';
import type { JSX } from 'react';

import { AlgoliaLogo, type AlgoliaLogoTranslations } from '../AlgoliaLogo';
import type { DocSearchSidepanelProps } from '../Sidepanel';
import type { StoredAskAiState, SuggestedQuestionHit } from '../types';
import { useAskAi } from '../useAskAi';
import { useSearchClient } from '../useSearchClient';
import { useSuggestedQuestions } from '../useSuggestedQuestions';
import { buildDummyAskAiHit } from '../utils/ai';

import { ConversationHistoryScreen } from './ConversationHistoryScreen';
import type { ConversationScreenTranslations } from './ConversationScreen';
import { ConversationScreen } from './ConversationScreen';
import type { NewConversationScreenTranslations } from './NewConversationScreen';
import { NewConversationScreen } from './NewConversationScreen';
import { PromptForm, type PromptFormTranslations } from './PromptForm';
import { SidepanelHeader } from './SidepanelHeader';
import { useManageSidepanelLayout } from './useManageSidepanelLayout';
import { useSidepanelKeyboardEvents } from './useSidepanelKeyboardEvents';

const BASE_WIDTH = 360;
const EXPANDED_WIDTH = 580;

type SidepanelState = 'conversation-history' | 'conversation' | 'new-conversation';

export type SidepanelTranslations = Partial<{
  /**
   * Translation texts for the prompt form.
   **/
  promptForm: PromptFormTranslations;
  /**
   * Translation texts for the conversation screen.
   **/
  conversationScreen: ConversationScreenTranslations;
  /**
   * Translation texts for the new conversation/starting screen.
   **/
  newConversationScreen: NewConversationScreenTranslations;
  /**
   * Translation text for the Algolia logo.
   **/
  logo: AlgoliaLogoTranslations;
}>;

export type PanelVariant = 'floating' | 'inline';
export type PanelSide = 'left' | 'right';

export type SidepanelProps = {
  /**
   * Variant of the Sidepanel positioning.
   *
   * - `inline` pushes page content when opened
   * - `floating` is positioned above all other content on page.
   *
   * @default 'inline'
   */
  variant?: PanelVariant;
  /**
   * Side of the page which the panel will originate from.
   *
   * @default 'right'
   */
  side?: PanelSide;
  /**
   * The selector of the element to push when Sidepanel opens with `inline` variant.
   *
   * @default `'#root, main, .app, body'`
   */
  pushSelector?: string;
  /**
   * Width of the Sidepanel (px or any CSS width).
   *
   * @default `360px`
   **/
  width?: number | string;
  /**
   * Width when expanded (px or any CSS width).
   *
   * @default `580px`
   **/
  expandedWidth?: number | string;
  /**
   * The container element where the panel should be portaled to.
   *
   * @default `document.body`
   */
  portalContainer?: DocumentFragment | Element | null;
  /**
   * Enables displaying suggested questions on new conversation screen.
   *
   * @default false
   */
  suggestedQuestions?: boolean;
  /**
   * Translations specific to the Sidepanel panel.
   **/
  translations?: SidepanelTranslations;
  /**
   * Configuration for keyboard shortcuts. Allows enabling/disabling specific shortcuts.
   *
   * @default `{ 'Ctrl/Cmd+I': true }`
   */
  keyboardShortcuts?: SidepanelShortcuts;
};

type Props = Omit<DocSearchSidepanelProps, 'button' | 'panel'> &
  SidepanelProps & {
    isOpen?: boolean;
    onOpen: () => void;
    onClose: () => void;
  };

export const Sidepanel = ({
  isOpen = false,
  onOpen,
  onClose,
  assistantId,
  searchApiKey,
  appId,
  indexName,
  variant = 'inline',
  searchParameters,
  pushSelector,
  width,
  expandedWidth,
  suggestedQuestions: suggestedQuestionsEnabled = false,
  translations = {},
  keyboardShortcuts,
  side = 'right',
}: Props): JSX.Element => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [sidepanelState, setSidepanelState] = React.useState<SidepanelState>('new-conversation');
  const [stoppedStreaming, setStoppedStreaming] = React.useState(false);

  const baseWidth = React.useMemo(() => {
    return typeof width === 'number' ? `${width}px` : (width ?? `${BASE_WIDTH}px`);
  }, [width]);

  const resolvedExpandedWidth = React.useMemo(() => {
    return typeof expandedWidth === 'number' ? `${expandedWidth}px` : (expandedWidth ?? `${EXPANDED_WIDTH}px`);
  }, [expandedWidth]);

  const expectedWidth = isExpanded ? resolvedExpandedWidth : baseWidth;
  const selectors = React.useMemo(() => pushSelector ?? '#root, main, .app, body', [pushSelector]);

  const toggleIsExpanded = useCallback((): void => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const searchClient = useSearchClient(appId, searchApiKey, (client) => client);

  const {
    status,
    sendMessage,
    stopAskAiStreaming,
    isStreaming,
    exchanges,
    setMessages,
    conversations,
    messages,
    sendFeedback,
    askAiStreamError,
  } = useAskAi({
    appId,
    indexName,
    assistantId,
    apiKey: searchApiKey,
    searchParameters,
  });

  const suggestedQuestions = useSuggestedQuestions({
    assistantId,
    suggestedQuestionsEnabled,
    searchClient,
  });

  const prevStatus = React.useRef(status);

  const handleSend = (prompt: string): void => {
    setStoppedStreaming(false);

    sendMessage({ text: prompt });
    setSidepanelState('conversation');
  };

  const handleStartNewConversation = (): void => {
    setMessages([]);
    setSidepanelState('new-conversation');
  };

  const handleSelectQuestion = (question: SuggestedQuestionHit): void => {
    setStoppedStreaming(false);
    setMessages([]);
    sendMessage(
      { text: question.question },
      {
        body: {
          suggestedQuestionId: question.objectID,
        },
      },
    );
    setSidepanelState('conversation');
  };

  const handleStopStreaming = (): void => {
    setStoppedStreaming(true);
    stopAskAiStreaming();
  };

  const handleSelectConversation = (conversation: StoredAskAiState): void => {
    if (conversation.messages) {
      setMessages(conversation.messages);
    } else if (conversation.query) {
      sendMessage({ text: conversation.query });
    }

    setSidepanelState('conversation');
  };

  useManageSidepanelLayout({
    variant,
    expectedWidth,
    selectors,
    isOpen,
    side,
  });

  useSidepanelKeyboardEvents({
    onClose,
    onOpen,
    isOpen,
    keyboardShortcuts,
  });

  React.useEffect(() => {
    if (prevStatus.current === 'streaming' && status === 'ready') {
      if (stoppedStreaming && messages.at(-1)) {
        messages.at(-1)!.metadata = {
          stopped: true,
        };
      }

      for (const part of messages[0].parts) {
        if (part.type === 'text') {
          conversations.add(buildDummyAskAiHit(part.text, messages));
        }
      }
    }

    prevStatus.current = status;
  }, [conversations, status, messages, stoppedStreaming]);

  return (
    <div
      className={`DocSearch-Sidepanel-Container ${variant} side-${side}${isOpen ? ' is-open' : ''}${isExpanded ? ' is-expanded' : ''}`}
      style={{ width: expectedWidth }}
      role="dialog"
      tabIndex={-1}
    >
      <aside id="docsearch-sidepanel" className="DocSearch-Sidepanel">
        <SidepanelHeader
          sidepanelState={sidepanelState}
          exchanges={exchanges}
          setSidepanelState={setSidepanelState}
          onNewConversation={handleStartNewConversation}
          onToggleExpanded={toggleIsExpanded}
          onClose={onClose}
        />
        <div className="DocSearch-Sidepanel-Content">
          {sidepanelState === 'new-conversation' && (
            <NewConversationScreen
              suggestedQuestions={suggestedQuestions}
              translations={translations.newConversationScreen}
              onSelectQuestion={handleSelectQuestion}
            />
          )}
          {sidepanelState === 'conversation' && (
            <ConversationScreen
              exchanges={exchanges}
              status={status}
              conversations={conversations}
              handleFeedback={sendFeedback}
              translations={translations.conversationScreen}
              streamError={askAiStreamError}
            />
          )}
          {sidepanelState === 'conversation-history' && (
            <ConversationHistoryScreen conversations={conversations} selectConversation={handleSelectConversation} />
          )}
        </div>
        <PromptForm
          exchanges={exchanges}
          isStreaming={isStreaming}
          status={status}
          translations={translations.promptForm}
          onSend={handleSend}
          onStopStreaming={handleStopStreaming}
        />
        <footer className="DocSearch-Sidepanel-Footer">
          <span className="DocSearch-Logo DocSearch-Sidepanel--powered-by">
            <AlgoliaLogo translations={translations.logo} />
          </span>
        </footer>
      </aside>
    </div>
  );
};
