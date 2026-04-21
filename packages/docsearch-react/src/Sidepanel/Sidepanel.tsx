import type { SidepanelShortcuts, InitialAskAiMessage } from '@docsearch/core';
import React, { useCallback } from 'react';
import type { JSX } from 'react';

import { AlgoliaLogo, type AlgoliaLogoTranslations } from '../AlgoliaLogo';
import type { DocSearchSidepanelProps, SidepanelSearchParameters } from '../Sidepanel';
import type { StoredAskAiState, SuggestedQuestionHit } from '../types';
import { useAskAi } from '../useAskAi';
import { useIsMobile } from '../useIsMobile';
import { useSearchClient } from '../useSearchClient';
import { useSuggestedQuestions } from '../useSuggestedQuestions';
import {
  buildDummyAskAiHit,
  filterExchangesForThreadDepthError,
  getAskAiBlockingBannerMessage,
  isAskAiPromptBlockingError,
  showAskAiBlockingBannerNewConversationLink,
  isThreadDepthError,
} from '../utils/ai';

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
  SidepanelProps &
  SidepanelSearchParameters & {
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
  const isMobile = useIsMobile();

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
    clearError,
    resetAskAiChatSession,
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

  const hasAskAiPromptBlockingError = React.useMemo(
    () => status === 'error' && isAskAiPromptBlockingError(askAiError, agentStudio),
    [status, askAiError, agentStudio],
  );

  const displayExchanges = React.useMemo(
    () => filterExchangesForThreadDepthError(exchanges, hasAskAiPromptBlockingError),
    [exchanges, hasAskAiPromptBlockingError],
  );

  const showThreadDepthBanner =
    sidepanelState === 'conversation' &&
    hasAskAiPromptBlockingError &&
    (isThreadDepthError(askAiError) ? messages.some((m) => m.role === 'assistant') : true);

  const threadDepthApiMessage = React.useMemo(() => getAskAiBlockingBannerMessage(askAiError), [askAiError]);

  const promptFormTranslations = React.useMemo(
    () => ({
      ...translations.promptForm,
      ...(translations.conversationScreen?.startNewConversationButtonText !== undefined
        ? { startNewConversationButtonText: translations.conversationScreen.startNewConversationButtonText }
        : {}),
    }),
    [translations.promptForm, translations.conversationScreen],
  );

  const prevStatus = React.useRef(status);

  const handleSend = (prompt: string): void => {
    setStoppedStreaming(false);
    clearError();

    sendMessage({ text: prompt });
    setSidepanelState('conversation');
  };

  const handleStartNewConversation = (): void => {
    clearError();
    resetAskAiChatSession();
    setSidepanelState('new-conversation');
  };

  const handleSelectQuestion = (question: SuggestedQuestionHit): void => {
    setStoppedStreaming(false);
    clearError();
    resetAskAiChatSession({
      kind: 'sendText',
      text: question.question,
      requestOptions: {
        body: {
          suggestedQuestionId: question.objectID,
        },
      },
    });
    setSidepanelState('conversation');
  };

  const handleStopStreaming = (): void => {
    setStoppedStreaming(true);
    stopAskAiStreaming();
  };

  const handleSelectConversation = React.useCallback(
    (conversation: StoredAskAiState): void => {
      clearError();
      if (conversation.messages) {
        resetAskAiChatSession({ kind: 'setMessages', messages: conversation.messages });
      } else if (conversation.query) {
        resetAskAiChatSession({ kind: 'sendText', text: conversation.query });
      }

      setSidepanelState('conversation');
    },
    [clearError, resetAskAiChatSession],
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

      const first = messages[0];
      if (first?.parts) {
        for (const part of first.parts) {
          if (part.type === 'text') {
            conversations.add(buildDummyAskAiHit(part.text, messages));
          }
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

  // Only re-run when `initialMessage` changes. Other handlers (e.g. `sendMessage`) can change every
  // render; listing them here was re-firing the effect and repeatedly clearing the chat.
  const initialMessageHandlingRef = React.useRef({
    clearError,
    resetAskAiChatSession,
    conversations,
    handleSelectConversation,
  });
  initialMessageHandlingRef.current = {
    clearError,
    resetAskAiChatSession,
    conversations,
    handleSelectConversation,
  };

  React.useEffect(() => {
    if (!initialMessage) return;

    const {
      clearError: clr,
      resetAskAiChatSession: resetSession,
      conversations: convs,
      handleSelectConversation: selectConv,
    } = initialMessageHandlingRef.current;

    let selectedConversation: StoredAskAiState | undefined;

    if (initialMessage.messageId) {
      selectedConversation = convs.getConversation?.(initialMessage.messageId);
    }

    if (selectedConversation) {
      selectConv(selectedConversation);
    } else {
      clr();
      resetSession(
        initialMessage.suggestedQuestionId
          ? {
              kind: 'sendText',
              text: initialMessage.query,
              requestOptions: {
                body: {
                  suggestedQuestionId: initialMessage.suggestedQuestionId,
                },
              },
            }
          : { kind: 'sendText', text: initialMessage.query },
      );
      setSidepanelState('conversation');
    }
  }, [initialMessage]);

  // Autofocus the prompt input when the sidepanel opens and blur it when
  // it closes. Disabled on mobile because focusing the textarea triggers the
  // virtual keyboard which disrupts the layout — this is a known issue that
  // has not been resolved yet.
  React.useEffect(() => {
    if (isOpen && !isMobile) {
      promptInputRef.current?.focus();
    }

    if (!isOpen) {
      promptInputRef.current?.blur();
    }
  }, [isOpen, isMobile]);

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
          exchanges={displayExchanges}
          setSidepanelState={setSidepanelState}
          hasConversations={conversations.getAll().length > 0}
          isStreaming={isStreaming}
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
              exchanges={displayExchanges}
              status={status}
              conversations={conversations}
              handleFeedback={sendFeedback}
              translations={translations.conversationScreen}
              streamError={askAiError}
              agentStudio={agentStudio}
            />
          )}
          {sidepanelState === 'conversation-history' && (
            <ConversationHistoryScreen conversations={conversations} selectConversation={handleSelectConversation} />
          )}
        </div>
        <PromptForm
          ref={promptInputRef}
          exchanges={displayExchanges}
          isStreaming={isStreaming}
          showThreadDepthBanner={showThreadDepthBanner}
          threadDepthApiMessage={threadDepthApiMessage}
          showBlockingBannerNewConversationLink={showAskAiBlockingBannerNewConversationLink(
            askAiError,
            Boolean(agentStudio),
          )}
          translations={promptFormTranslations}
          onSend={handleSend}
          onStartNewConversation={handleStartNewConversation}
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
