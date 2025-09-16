import type { UseChatHelpers } from '@ai-sdk/react';
import React, { type JSX, useMemo, useState, useEffect } from 'react';

import { AggregatedSearchBlock } from './AggregatedSearchBlock';
import { AlertIcon, LoadingIcon, SearchIcon } from './icons';
import { MemoizedMarkdown } from './MemoizedMarkdown';
import type { ScreenStateProps } from './ScreenState';
import type { StoredSearchPlugin } from './stored-searches';
import type { InternalDocSearchHit, StoredAskAiState } from './types';
import type { AIMessage } from './types/AskiAi';
import { extractLinksFromMessage, getMessageContent } from './utils/ai';
import { groupConsecutiveToolResults } from './utils/groupConsecutiveToolResults';

export type AskAiScreenTranslations = Partial<{
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
  // Tool call texts
  preToolCallText: string;
  duringToolCallText: string;
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
}>;

type AskAiScreenProps = Omit<ScreenStateProps<InternalDocSearchHit>, 'translations'> & {
  messages: AIMessage[];
  status: UseChatHelpers<AIMessage>['status'];
  askAiStreamError: Error | null;
  askAiFetchError: Error | undefined;
  translations?: AskAiScreenTranslations;
};

interface AskAiScreenHeaderProps {
  disclaimerText: string;
}

interface Exchange {
  id: string;
  userMessage: AIMessage;
  assistantMessage: AIMessage | null;
}

function AskAiScreenHeader({ disclaimerText }: AskAiScreenHeaderProps): JSX.Element {
  return <p className="DocSearch-AskAiScreen-Disclaimer">{disclaimerText}</p>;
}

interface AskAiExchangeCardProps {
  exchange: Exchange;
  askAiStreamError: Error | null;
  isLastExchange: boolean;
  loadingStatus: UseChatHelpers<AIMessage>['status'];
  onSearchQueryClick: (query: string) => void;
  translations: AskAiScreenTranslations;
  conversations: StoredSearchPlugin<StoredAskAiState>;
  onFeedback?: (messageId: string, thumbs: 0 | 1) => Promise<void>;
}

function AskAiExchangeCard({
  exchange,
  askAiStreamError,
  isLastExchange,
  loadingStatus,
  onSearchQueryClick,
  translations,
  conversations,
  onFeedback,
}: AskAiExchangeCardProps): JSX.Element {
  const { userMessage, assistantMessage } = exchange;

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

  return (
    <div className="DocSearch-AskAiScreen-Response-Container">
      <div className="DocSearch-AskAiScreen-Response">
        <div className="DocSearch-AskAiScreen-Message DocSearch-AskAiScreen-Message--user">
          <p className="DocSearch-AskAiScreen-Query">{userContent?.text ?? ''}</p>
        </div>
        <div className="DocSearch-AskAiScreen-Message DocSearch-AskAiScreen-Message--assistant">
          <div className="DocSearch-AskAiScreen-MessageContent">
            {loadingStatus === 'error' && askAiStreamError && isLastExchange && (
              <div className="DocSearch-AskAiScreen-MessageContent DocSearch-AskAiScreen-Error">
                <AlertIcon />
                <MemoizedMarkdown
                  content={askAiStreamError.message}
                  copyButtonText=""
                  copyButtonCopiedText=""
                  isStreaming={false}
                />
              </div>
            )}
            {isThinking && (
              <div className="DocSearch-AskAiScreen-MessageContent-Reasoning">
                <span className="shimmer">{translations.thinkingText || 'Thinking...'}</span>
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
              if (part.type === 'tool-searchIndex') {
                switch (part.state) {
                  case 'input-streaming':
                    return (
                      <div key={index} className="DocSearch-AskAiScreen-MessageContent-Tool Tool--PartialCall shimmer">
                        <LoadingIcon className="DocSearch-AskAiScreen-SmallerLoadingIcon" />
                        <span>{translations.preToolCallText || 'Searching...'}</span>
                      </div>
                    );
                  case 'input-available':
                    return (
                      <div key={index} className="DocSearch-AskAiScreen-MessageContent-Tool Tool--Call shimmer">
                        <LoadingIcon className="DocSearch-AskAiScreen-SmallerLoadingIcon" />
                        <span>
                          {`${translations.duringToolCallText || 'Searching for '} "${part.input.query || ''}" ...`}
                        </span>
                      </div>
                    );
                  case 'output-available':
                    return (
                      <div key={index} className="DocSearch-AskAiScreen-MessageContent-Tool Tool--Result">
                        <SearchIcon />
                        <span>
                          {`${translations.afterToolCallText || 'Searched for'}`}{' '}
                          <span
                            role="button"
                            tabIndex={0}
                            className="DocSearch-AskAiScreen-MessageContent-Tool-Query"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onSearchQueryClick(part.output.query || '');
                              }
                            }}
                            onClick={() => onSearchQueryClick(part.output.query || '')}
                          >
                            {' '}
                            &quot;{part.output.query || ''}&quot;
                          </span>{' '}
                          found {part.output.hits?.length || 0} results
                        </span>
                      </div>
                    );
                  default:
                    break;
                }
              }
              // fallback for unknown part type
              return null;
            })}
          </div>

          {wasStopped && <p className="DocSearck-AskAiScreen-MessageContent-Stopped">You stopped this response</p>}
        </div>
        <div className="DocSearch-AskAiScreen-Answer-Footer">
          <AskAiScreenFooterActions
            id={userMessage?.id || exchange.id}
            showActions={showActions}
            latestAssistantMessageContent={assistantContent?.text || null}
            translations={translations}
            conversations={conversations}
            onFeedback={onFeedback}
          />
        </div>
      </div>

      {/* Sources for this exchange */}
      {urlsToDisplay.length > 0 ? (
        <AskAiSourcesPanel urlsToDisplay={urlsToDisplay} relatedSourcesText={translations.relatedSourcesText} />
      ) : null}
    </div>
  );
}

interface AskAiScreenFooterActionsProps {
  id: string;
  showActions: boolean;
  latestAssistantMessageContent: string | null;
  translations: AskAiScreenTranslations;
  conversations: StoredSearchPlugin<StoredAskAiState>;
  onFeedback?: (messageId: string, thumbs: 0 | 1) => Promise<void>;
}

function AskAiScreenFooterActions({
  id,
  showActions,
  latestAssistantMessageContent,
  translations,
  conversations,
  onFeedback,
}: AskAiScreenFooterActionsProps): JSX.Element | null {
  // local state for feedback, initialised from stored conversations
  const initialFeedback = React.useMemo(() => {
    const message = conversations.getOne?.(id);
    return message?.feedback ?? null;
  }, [conversations, id]);

  const [feedback, setFeedback] = React.useState<'dislike' | 'like' | null>(initialFeedback);
  const [saving, setSaving] = React.useState(false);
  const [savingError, setSavingError] = React.useState<Error | null>(null);

  const handleFeedback = async (value: 'dislike' | 'like'): Promise<void> => {
    if (saving) return;
    setSavingError(null);
    setSaving(true);
    try {
      await onFeedback?.(id, value === 'like' ? 1 : 0);
      setFeedback(value);
    } catch (error) {
      setSavingError(error as Error);
    } finally {
      setSaving(false);
    }
  };

  const {
    likeButtonTitle = 'Like',
    dislikeButtonTitle = 'Dislike',
    thanksForFeedbackText = 'Thanks for your feedback!',
  } = translations;

  if (!showActions || !latestAssistantMessageContent) {
    return null;
  }

  return (
    <div className="DocSearch-AskAiScreen-Actions">
      {feedback === null ? (
        <>
          {saving ? (
            <LoadingIcon className="DocSearch-AskAiScreen-SmallerLoadingIcon" />
          ) : (
            <>
              <LikeButton title={likeButtonTitle} onClick={() => handleFeedback('like')} />
              <DislikeButton title={dislikeButtonTitle} onClick={() => handleFeedback('dislike')} />
            </>
          )}
          {savingError && (
            <p className="DocSearch-AskAiScreen-FeedbackText">{savingError.message || 'An error occured'}</p>
          )}
        </>
      ) : (
        <p className="DocSearch-AskAiScreen-FeedbackText DocSearch-AskAiScreen-FeedbackText--visible">
          {thanksForFeedbackText}
        </p>
      )}
      <CopyButton
        translations={translations}
        onClick={() => navigator.clipboard.writeText(latestAssistantMessageContent)}
      />
    </div>
  );
}

interface AskAiSourcesPanelProps {
  urlsToDisplay: Array<{ url: string; title?: string }>;
  relatedSourcesText?: string;
}

function AskAiSourcesPanel({ urlsToDisplay, relatedSourcesText }: AskAiSourcesPanelProps): JSX.Element {
  return (
    <div className="DocSearch-AskAiScreen-RelatedSources">
      <p className="DocSearch-AskAiScreen-RelatedSources-Title">{relatedSourcesText || 'Related sources'}</p>
      <div className="DocSearch-AskAiScreen-RelatedSources-List">
        {urlsToDisplay.length > 0 &&
          urlsToDisplay.map((link) => (
            <a
              key={link.url}
              href={link.url}
              className="DocSearch-AskAiScreen-RelatedSources-Item-Link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <RelatedSourceIcon />
              <span>{link.title || link.url}</span>
            </a>
          ))}
      </div>
    </div>
  );
}

export function AskAiScreen({ translations = {}, ...props }: AskAiScreenProps): JSX.Element | null {
  const { disclaimerText = 'Answers are generated with AI which can make mistakes. Verify responses.' } = translations;

  const { messages } = props;

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
    return grouped;
  }, [messages]);

  const handleSearchQueryClick = (query: string): void => {
    props.onAskAiToggle(false);
    props.setQuery(query);
  };

  return (
    <div className="DocSearch-AskAiScreen DocSearch-AskAiScreen-Container">
      <AskAiScreenHeader disclaimerText={disclaimerText} />
      <div className="DocSearch-AskAiScreen-Body">
        <div className="DocSearch-AskAiScreen-ExchangesList">
          {exchanges
            .slice()
            .reverse()
            .map((exchange, index) => (
              <AskAiExchangeCard
                key={exchange.id}
                exchange={exchange}
                askAiStreamError={props.askAiStreamError}
                isLastExchange={index === 0}
                loadingStatus={props.status}
                translations={translations}
                conversations={props.conversations}
                onSearchQueryClick={handleSearchQueryClick}
                onFeedback={props.onFeedback}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function RelatedSourceIcon(): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="9" y2="9" />
      <line x1="4" x2="20" y1="15" y2="15" />
      <line x1="10" x2="8" y1="3" y2="21" />
      <line x1="16" x2="14" y1="3" y2="21" />
    </svg>
  );
}

function CopyButton({
  onClick,
  translations,
}: {
  onClick: () => void;
  translations: AskAiScreenTranslations;
}): JSX.Element {
  const { copyButtonTitle = 'Copy', copyButtonCopiedText = 'Copied!' } = translations;

  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 1500); // reset after 1.5 seconds
      return (): void => clearTimeout(timer);
    }
    return undefined;
  }, [isCopied]);

  const handleClick = (): void => {
    onClick();
    setIsCopied(true);
  };

  return (
    <button
      type="button"
      className={`DocSearch-AskAiScreen-ActionButton DocSearch-AskAiScreen-CopyButton ${
        isCopied ? 'DocSearch-AskAiScreen-CopyButton--copied' : ''
      }`}
      disabled={isCopied} // disable button briefly after copy
      title={isCopied ? copyButtonCopiedText : copyButtonTitle}
      onClick={handleClick}
    >
      {isCopied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-check-icon lucide-check"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-copy-icon lucide-copy"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      )}
    </button>
  );
}

function LikeButton({ title, onClick }: { title: string; onClick: () => void }): JSX.Element {
  // @todo: implement like button
  return (
    <button
      type="button"
      className="DocSearch-AskAiScreen-ActionButton DocSearch-AskAiScreen-LikeButton"
      title={title}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-thumbs-up-icon lucide-thumbs-up"
      >
        <path d="M7 10v12" />
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
      </svg>
    </button>
  );
}

function DislikeButton({ title, onClick }: { title: string; onClick: () => void }): JSX.Element {
  // @todo: implement dislike button
  return (
    <button
      type="button"
      className="DocSearch-AskAiScreen-ActionButton DocSearch-AskAiScreen-DislikeButton"
      title={title}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-thumbs-down-icon lucide-thumbs-down"
      >
        <path d="M17 14V2" />
        <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
      </svg>
    </button>
  );
}
