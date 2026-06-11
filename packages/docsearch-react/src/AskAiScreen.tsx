import type { UseChatHelpers } from '@ai-sdk/react';
import React, { type JSX, useMemo } from 'react';

import { AggregatedSearchBlock } from './AggregatedSearchBlock';
import type { AskAiScreenStateProps } from './AskAiScreenState';
import { FeedbackActions } from './components/FeedbackActions';
import { SourcesPanel } from './components/SourcesPanel';
import { ToolCall, type ToolCallTranslations } from './components/ToolCall';
import { AlertIcon, LoadingIcon, SparklesIcon } from './icons';
import { MemoizedMarkdown } from './MemoizedMarkdown';
import type { StoredSearchPlugin } from './stored-searches';
import type { InternalDocSearchHit, OnAskAiFeedback, StoredAskAiState } from './types';
import { type AIMessage, type ToolCalls } from './types/AskiAi';
import { extractLinksFromMessage, getMessageContent, isThreadDepthError, isAIToolPart } from './utils/ai';
import { groupConsecutiveToolResults } from './utils/groupConsecutiveToolResults';

export type AskAiScreenTranslations = Partial<
  // Inherit the shared tool-call translations, but expose the search-related
  // keys under AskAiScreen's own public names (see mapping below).
  Omit<ToolCallTranslations, 'searchingText' | 'toolCallResultText'> & {
    // Misc texts
    disclaimerText: string;
    relatedSourcesText: string;
    thinkingText: string;
    copyButtonText: string;
    copyButtonCopiedText: string;
    // Feedback buttons
    copyButtonTitle: string;
    likeButtonTitle: string;
    dislikeButtonTitle: string;
    thanksForFeedbackText: string;
    // Negative feedback note panel
    feedbackPanelTitle: string;
    feedbackDetailsPlaceholder: string;
    feedbackDisclaimerText: string;
    feedbackSubmitButtonText: string;
    feedbackCloseButtonTitle: string;
    feedbackTagIncorrect: string;
    feedbackTagNotWhatIAsked: string;
    feedbackTagSlowOrBuggy: string;
    feedbackTagStyleOrTone: string;
    feedbackTagSafetyOrLegal: string;
    feedbackTagOther: string;
    // Tool call texts
    /**
     * Text shown while assistant is performing search tool call.
     * Maps to `ToolCallTranslations.searchingText`.
     */
    duringToolCallText: string;
    /**
     * Text shown while assistant is finished performing tool call.
     * Maps to `ToolCallTranslations.toolCallResultText`.
     */
    afterToolCallText: string;
    /**
     * Build the full jsx element for the aggregated search block.
     * If provided, completely overrides the default english renderer.
     */
    aggregatedToolCallNode?: (queries: string[], onSearchQueryClick: (query: string) => void) => React.ReactNode;
    /**
     * Generate the list connective parts only (backwards compatibility).
     * Receives full list of queries and should return translation parts for before/after/separators.
     * Example: (qs) => ({ before: 'searched for ', separator: ', ', lastSeparator: ' and ', after: '' }).
     */
    aggregatedToolCallText?: (queries: string[]) => {
      before?: string;
      separator?: string;
      lastSeparator?: string;
      after?: string;
    };
    /**
     * Message that's shown when user has stopped the streaming of a message.
     */
    stoppedStreamingText: string;
    /**
     * Error title shown if there is an error while chatting.
     */
    errorTitleText: string;
    /**
     * Message shown when thread depth limit is exceeded (AI-217 error).
     */
    threadDepthExceededMessage: string;
    /**
     * Button text for starting a new conversation after thread depth error.
     */
    startNewConversationButtonText: string;
  }
>;

/**
 * Maps AskAiScreen's public translation keys to the shared `ToolCallTranslations`
 * shape consumed by the `ToolCall` component, applying default English values.
 */
function toToolCallTranslations(translations: AskAiScreenTranslations): ToolCallTranslations {
  const {
    preToolCallText = 'Searching...',
    duringToolCallText = 'Searching...',
    afterToolCallText = 'Searched for',
    savedMemoryToolResultText = 'Saved to memory',
    memoryToolResultText = 'Used memory to enhance results',
  } = translations;

  return {
    preToolCallText,
    searchingText: duringToolCallText,
    toolCallResultText: afterToolCallText,
    savedMemoryToolResultText,
    memoryToolResultText,
  };
}

type AskAiScreenProps = Omit<AskAiScreenStateProps<InternalDocSearchHit>, 'translations'> & {
  messages: AIMessage[];
  tools: ToolCalls;
  status: UseChatHelpers<AIMessage>['status'];
  askAiError?: Error;
  translations?: AskAiScreenTranslations;
  onNewConversation: () => void;
  memoryEnabled?: boolean;
};

interface AskAiScreenHeaderProps {
  disclaimerText: string;
}

export interface Exchange {
  id: string;
  userMessage: AIMessage;
  assistantMessage: AIMessage | null;
}

function AskAiScreenDisclaimer({ disclaimerText }: AskAiScreenHeaderProps): JSX.Element {
  return (
    <p className="DocSearch-AskAiScreen-Disclaimer">
      <SparklesIcon /> {disclaimerText}
    </p>
  );
}

interface AskAiExchangeCardProps {
  exchange: Exchange;
  askAiError?: Error;
  isLastExchange: boolean;
  loadingStatus: UseChatHelpers<AIMessage>['status'];
  onSearchQueryClick: (query: string) => void;
  translations: AskAiScreenTranslations;
  tools: ToolCalls;
  conversations: StoredSearchPlugin<StoredAskAiState>;
  onFeedback?: OnAskAiFeedback;
  memoryEnabled?: boolean;
}

function AskAiExchangeCard({
  exchange,
  askAiError,
  isLastExchange,
  loadingStatus,
  onSearchQueryClick,
  translations,
  tools,
  conversations,
  onFeedback,
  memoryEnabled,
}: AskAiExchangeCardProps): JSX.Element {
  const { userMessage, assistantMessage } = exchange;

  const {
    stoppedStreamingText = 'You stopped this response',
    errorTitleText = 'Chat error',
    relatedSourcesText,
  } = translations;

  const toolCallTranslations = useMemo(() => toToolCallTranslations(translations), [translations]);

  const isThreadDepth = isThreadDepthError(askAiError);

  const assistantContent = useMemo(() => getMessageContent(assistantMessage), [assistantMessage]);
  const userContent = useMemo(() => getMessageContent(userMessage), [userMessage]);

  const urlsToDisplay = React.useMemo(() => extractLinksFromMessage(assistantMessage), [assistantMessage]);

  const displayParts = React.useMemo(() => {
    return groupConsecutiveToolResults(assistantMessage?.parts || []);
  }, [assistantMessage]);

  const wasStopped = userMessage.metadata?.stopped || assistantMessage?.metadata?.stopped;

  const showActions =
    !wasStopped && (!isLastExchange || (isLastExchange && loadingStatus === 'ready' && Boolean(assistantMessage)));

  const isThinking =
    ['submitted', 'streaming'].includes(loadingStatus) &&
    isLastExchange &&
    !displayParts.some((part) => part.type !== 'step-start');

  const messageId = assistantMessage?.id || exchange.id;

  return (
    <div className="DocSearch-AskAiScreen-Response-Container">
      <div className="DocSearch-AskAiScreen-Response">
        <div className="DocSearch-AskAiScreen-Message DocSearch-AskAiScreen-Message--user">
          <p className="DocSearch-AskAiScreen-Query">{userContent?.text ?? ''}</p>
        </div>
        <div className="DocSearch-AskAiScreen-Message DocSearch-AskAiScreen-Message--assistant">
          <div className="DocSearch-AskAiScreen-MessageContent">
            {loadingStatus === 'error' && askAiError && isLastExchange && !isThreadDepth && (
              <div className="DocSearch-AskAiScreen-Error" role="alert">
                <AlertIcon aria-hidden="true" />
                <div className="DocSearch-AskAiScreen-Error-Content">
                  <h4 className="DocSearch-AskAiScreen-Error-Title">{errorTitleText}</h4>
                  <MemoizedMarkdown
                    content={askAiError.message}
                    copyButtonText=""
                    copyButtonCopiedText=""
                    isStreaming={false}
                  />
                </div>
              </div>
            )}
            {isThinking && (
              <div className="DocSearch-AskAiScreen-MessageContent-Thinking" role="status">
                <span className="shimmer">{translations.thinkingText || 'Thinking...'}</span>
                <span className="DocSearch-AskAi-Thinking-Skeleton shimmer" />
                <span className="DocSearch-AskAi-Thinking-Skeleton DocSearch-AskAi-Thinking-Skeleton--short shimmer" />
              </div>
            )}
            {displayParts.map((part, idx) => {
              const index = idx;

              if (typeof part === 'string') {
                return (
                  <MemoizedMarkdown
                    key={index}
                    content={part}
                    copyButtonText={translations.copyButtonText || 'Copy'}
                    copyButtonCopiedText={translations.copyButtonCopiedText || 'Copied!'}
                    isStreaming={loadingStatus === 'streaming'}
                  />
                );
              }

              if (isAIToolPart(part)) {
                return (
                  <ToolCall
                    key={index}
                    translations={toolCallTranslations}
                    part={part}
                    tools={tools}
                    memoryEnabled={memoryEnabled}
                    onSearchQueryClick={onSearchQueryClick}
                  />
                );
              }

              if (part.type === 'aggregated-tool-call') {
                return (
                  <AggregatedSearchBlock
                    key={index}
                    queries={part.queries}
                    translations={translations}
                    onSearchQueryClick={onSearchQueryClick}
                  />
                );
              }

              if (part.type === 'reasoning' && part.state === 'streaming') {
                return (
                  <div key={index} className="DocSearch-AskAiScreen-MessageContent-Reasoning shimmer">
                    <LoadingIcon className="DocSearch-AskAiScreen-SmallerLoadingIcon" />
                    <span className="shimmer">Reasoning...</span>
                  </div>
                );
              }

              if (part.type === 'text') {
                return (
                  <MemoizedMarkdown
                    key={index}
                    content={part.text}
                    copyButtonText={translations.copyButtonText || 'Copy'}
                    copyButtonCopiedText={translations.copyButtonCopiedText || 'Copied!'}
                    isStreaming={part.state === 'streaming'}
                  />
                );
              }

              // fallback for unknown part type
              return null;
            })}
          </div>

          {wasStopped && <p className="DocSearck-AskAiScreen-MessageContent-Stopped">{stoppedStreamingText}</p>}
        </div>
        <div className="DocSearch-AskAiScreen-Answer-Footer">
          <SourcesPanel links={urlsToDisplay} titleText={relatedSourcesText} />
          <FeedbackActions
            id={messageId}
            showActions={showActions}
            latestAssistantMessageContent={assistantContent?.text || null}
            translations={translations}
            conversations={conversations}
            onFeedback={onFeedback}
          />
        </div>
      </div>
    </div>
  );
}

export function AskAiScreen({ translations = {}, ...props }: AskAiScreenProps): JSX.Element | null {
  const {
    disclaimerText = 'Answers are generated with AI which can make mistakes.',
    threadDepthExceededMessage = 'This conversation is now closed to keep responses accurate.',
    startNewConversationButtonText = 'Start a new conversation',
  } = translations;

  const { messages, tools, askAiError, status, memoryEnabled } = props;

  // Check if there's a thread depth error
  const hasThreadDepthError = useMemo(() => {
    return status === 'error' && isThreadDepthError(askAiError);
  }, [status, askAiError]);

  // Group messages into exchanges (user + assistant pairs)
  const exchanges: Exchange[] = useMemo(() => {
    const grouped: Exchange[] = [];
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].role === 'user') {
        const userMessage = messages[i];
        const assistantMessage = messages[i + 1]?.role === 'assistant' ? messages[i + 1] : null;
        grouped.push({ id: userMessage.id, userMessage, assistantMessage });
        if (assistantMessage) {
          i++;
        }
      }
    }

    // If there's a thread depth error, remove the last exchange (the one that triggered the error)
    // We only want to show successful exchanges
    if (hasThreadDepthError && grouped.length > 0) {
      // Check if the last exchange has no assistant message (failed to complete)
      const lastExchange = grouped[grouped.length - 1];
      if (!lastExchange.assistantMessage) {
        grouped.pop();
      }
    }

    return grouped;
  }, [messages, hasThreadDepthError]);

  const handleSearchQueryClick = (query: string): void => {
    props.onAskAiToggle(false);
    props.setQuery(query);
  };

  // Only show the thread depth error if we have assistant messages
  const showThreadDepthError = hasThreadDepthError && messages.some((m) => m.role === 'assistant');

  return (
    <div className="DocSearch-AskAiScreen DocSearch-AskAiScreen-Container">
      {/* Thread Depth Error */}
      {showThreadDepthError && (
        <div className="DocSearch-AskAiScreen-MessageContent DocSearch-AskAiScreen-Error DocSearch-AskAiScreen-Error--ThreadDepth">
          <div className="DocSearch-AskAiScreen-Error-Content">
            <p>
              {threadDepthExceededMessage}{' '}
              <button type="button" className="DocSearch-ThreadDepthError-Link" onClick={props.onNewConversation}>
                {startNewConversationButtonText}
              </button>{' '}
              to continue.
            </p>
          </div>
        </div>
      )}

      <AskAiScreenDisclaimer disclaimerText={disclaimerText} />

      <div className="DocSearch-AskAiScreen-Body">
        <div className="DocSearch-AskAiScreen-ExchangesList">
          {exchanges
            .slice()
            .reverse()
            .map((exchange, index) => (
              <AskAiExchangeCard
                key={exchange.id}
                exchange={exchange}
                askAiError={props.askAiError}
                isLastExchange={index === 0}
                loadingStatus={props.status}
                translations={translations}
                tools={tools}
                conversations={props.conversations}
                memoryEnabled={memoryEnabled}
                onSearchQueryClick={handleSearchQueryClick}
                onFeedback={props.onFeedback}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
