import type { SidepanelShortcuts, InitialAskAiMessage } from '@docsearch/core';
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
import { setSidepanelSearchClient } from './setSidepanelSearchClient';
import type { HeaderTranslations } from './SidepanelHeader';
import { SidepanelHeader } from './SidepanelHeader';
import type { PanelSide, PanelVariant, SidepanelState } from './types';
import { useManageSidepanelLayout } from './useManageSidepanelLayout';
import { useSidepanelKeyboardEvents } from './useSidepanelKeyboardEvents';
import { useSidepanelWidth } from './useSidepanelWidth';

/**
 * Imperative handle exposed by the Sidepanel component for programmatic control.
 */
export interface SidepanelRef {
  /** Opens the sidepanel. */
  open: () => void;
  /** Closes the sidepanel. */
  close: () => void;
  /** Returns true once the component is mounted and ready. */
  readonly isReady: boolean;
  /** Returns true if the sidepanel is currently open. */
  readonly isOpen: boolean;
}

export type SidepanelTranslations = Partial<{
  /**
   * Translation texts for the Sidepanel header.
   **/
  header: HeaderTranslations;
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

export type SidepanelProps = {
  /**
   * Variant of the Sidepanel positioning.
   *
   * - `inline` pushes page content when opened
   * - `floating` is positioned above all other content on page.
   *
   * @default 'floating'
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
  // HACK: This is a hack for testing staging, remove before releasing
  useStagingEnv?: boolean;
};

type Props = Omit<DocSearchSidepanelProps, 'button' | 'panel'> &
  SidepanelProps & {
    isOpen?: boolean;
    onOpen: () => void;
    onClose: () => void;
    initialMessage?: InitialAskAiMessage;
  };

function SidepanelInner(
  {
    isOpen = false,
    onOpen,
    onClose,
    assistantId,
    apiKey,
    appId,
    indexName,
    variant = 'floating',
    searchParameters,
    pushSelector,
    width,
    expandedWidth,
    suggestedQuestions: suggestedQuestionsEnabled = false,
    translations = {},
    keyboardShortcuts,
    side = 'right',
    initialMessage,
    useStagingEnv = false,
    agentStudio = false,
  }: Props,
  ref: React.ForwardedRef<SidepanelRef>,
): JSX.Element {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [sidepanelState, setSidepanelState] = React.useState<SidepanelState>('new-conversation');
  const [stoppedStreaming, setStoppedStreaming] = React.useState(false);
  const sidepanelContainerRef = React.useRef<HTMLDivElement>(null);
  const promptInputRef = React.useRef<HTMLTextAreaElement>(null);

  const expectedWidth = useSidepanelWidth({
    isExpanded,
    width,
    expandedWidth,
  });

  const selectors = React.useMemo(() => pushSelector ?? '#root, main, .app, body', [pushSelector]);

  const toggleIsExpanded = useCallback((): void => {
    setIsExpanded(!isExpanded);
  }, [isExpanded]);

  const searchClient = useSearchClient(appId, apiKey, setSidepanelSearchClient);

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
    askAiError,
  } = useAskAi({
    appId,
    indexName,
    assistantId,
    apiKey,
    searchParameters,
    useStagingEnv,
    agentStudio,
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

  const handleSelectConversation = React.useCallback(
    (conversation: StoredAskAiState): void => {
      if (conversation.messages) {
        setMessages(conversation.messages);
      } else if (conversation.query) {
        sendMessage({ text: conversation.query });
      }

      setSidepanelState('conversation');
    },
    [sendMessage, setMessages],
  );

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

  // Expose imperative handle for programmatic control
  React.useImperativeHandle(
    ref,
    () => ({
      open: onOpen,
      close: onClose,
      get isReady(): boolean {
        return true;
      },
      get isOpen(): boolean {
        return isOpen;
      },
    }),
    [onOpen, onClose, isOpen],
  );

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

  React.useEffect(() => {
    function setFullViewportHeight(): void {
      if (sidepanelContainerRef.current) {
        const vh = window.innerHeight * 0.01;
        sidepanelContainerRef.current.style.setProperty('--sp-vh', `${vh}px`);
      }
    }

    setFullViewportHeight();

    window.addEventListener('resize', setFullViewportHeight);

    return (): void => {
      window.removeEventListener('resize', setFullViewportHeight);
    };
  }, []);

  React.useEffect(() => {
    if (!initialMessage) return;

    let selectedConversation: StoredAskAiState | undefined;

    if (initialMessage.messageId) {
      selectedConversation = conversations.getConversation?.(initialMessage.messageId);
    }

    if (selectedConversation) {
      handleSelectConversation(selectedConversation);
    } else {
      setMessages([]);
      sendMessage(
        {
          text: initialMessage.query,
        },
        initialMessage.suggestedQuestionId
          ? {
              body: {
                suggestedQuestionId: initialMessage.suggestedQuestionId,
              },
            }
          : {},
      );
      setSidepanelState('conversation');
    }
  }, [initialMessage, sendMessage, conversations, handleSelectConversation, setMessages]);

  // eslint-disable-next-line no-warning-comments
  // FIX: Renable autofocus on open once mobile focus issue is solved
  // React.useEffect(() => {
  //   promptInputRef.current?.focus();
  // }, [isOpen]);

  return (
    <div
      className={`DocSearch-Sidepanel-Container ${variant} side-${side}${isOpen ? ' is-open' : ''}${isExpanded ? ' is-expanded' : ''}`}
      style={
        {
          '--sp-width': expectedWidth,
        } as React.CSSProperties
      }
      role="dialog"
      tabIndex={-1}
      ref={sidepanelContainerRef}
    >
      <aside id="docsearch-sidepanel" className={`DocSearch-Sidepanel ${sidepanelState}`}>
        <SidepanelHeader
          sidepanelState={sidepanelState}
          exchanges={exchanges}
          setSidepanelState={setSidepanelState}
          hasConversations={conversations.getAll().length > 0}
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
              streamError={askAiError}
            />
          )}
          {sidepanelState === 'conversation-history' && (
            <ConversationHistoryScreen conversations={conversations} selectConversation={handleSelectConversation} />
          )}
        </div>
        <PromptForm
          ref={promptInputRef}
          exchanges={exchanges}
          isStreaming={isStreaming}
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
}

export const Sidepanel = React.forwardRef(SidepanelInner);
