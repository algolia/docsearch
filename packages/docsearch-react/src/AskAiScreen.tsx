import type { UseChatHelpers } from '@ai-sdk/react';
import React, { type JSX, useState, useEffect, useMemo } from 'react';

import { SparklesIcon, LoadingIcon, SearchIcon } from './icons';
import { MemoizedMarkdown } from './MemoizedMarkdown';
import type { ScreenStateProps } from './ScreenState';
import type { InternalDocSearchHit } from './types';
import { extractLinksFromText } from './utils/ai';

export type AskAiScreenTranslations = Partial<{
  titleText: string;
  disclaimerText: string;
  relatedSourcesText: string;
  thinkingText: string;
}>;

type AskAiScreenProps = Omit<ScreenStateProps<InternalDocSearchHit>, 'translations'> & {
  messages: UseChatHelpers['messages'];
  status: UseChatHelpers['status'];
  translations?: AskAiScreenTranslations;
};

interface AskAiScreenHeaderProps {
  disclaimerText: string;
}

interface Exchange {
  id: string;
  userMessage: UseChatHelpers['messages'][number];
  assistantMessage: UseChatHelpers['messages'][number] | null;
}

function AskAiScreenHeader({ disclaimerText }: AskAiScreenHeaderProps): JSX.Element {
  return (
    <div className="DocSearch-AskAiScreen-Header">
      <div className="DocSearch-Screen-Icon">
        <SparklesIcon />
      </div>
      <p className="DocSearch-AskAi-Disclaimer">{disclaimerText}</p>
    </div>
  );
}

interface AskAiExchangeCardProps {
  exchange: Exchange;
  isLastExchange: boolean;
  loadingStatus: UseChatHelpers['status'];
  translations: AskAiScreenTranslations;
}

function AskAiExchangeCard({
  exchange,
  isLastExchange,
  loadingStatus,
  translations,
}: AskAiExchangeCardProps): JSX.Element {
  const { userMessage, assistantMessage } = exchange;

  const showActions = !isLastExchange || (isLastExchange && loadingStatus === 'ready' && Boolean(assistantMessage));

  const urlsToDisplay = extractLinksFromText(assistantMessage?.content || '');

  return (
    <div className="DocSearch-AskAiScreen-Response-Container">
      <div className="DocSearch-AskAiScreen-Response">
        <div className="DocSearch-AskAiScreen-Message DocSearch-AskAiScreen-Message--user">
          <p className="DocSearch-AskAiScreen-Query">{userMessage.content}</p>
        </div>
        <div className="DocSearch-AskAiScreen-Message DocSearch-AskAiScreen-Message--assistant">
          <div className="DocSearch-AskAiScreen-MessageContent">
            {Array.isArray(assistantMessage?.parts)
              ? assistantMessage.parts.map((part, idx) => {
                  const index = idx;
                  if (part.type === 'text') {
                    return (
                      <MemoizedMarkdown
                        key={index}
                        content={part.text}
                        id={`ask-ai-message-${assistantMessage?.id}-${idx}`}
                      />
                    );
                  }
                  if (part.type === 'tool-invocation') {
                    const { toolInvocation } = part;
                    if (toolInvocation.toolName === 'searchIndex') {
                      switch (toolInvocation.state) {
                        case 'partial-call':
                          return (
                            <div
                              key={index}
                              className="DocSearch-AskAiScreen-MessageContent-Tool Tool--PartialCall shimmer"
                            >
                              <LoadingIcon className="DocSearch-AskAiScreen-SmallerLoadingIcon" />
                              <span>Searching through the docs...</span>
                            </div>
                          );
                        case 'call':
                          return (
                            <div key={index} className="DocSearch-AskAiScreen-MessageContent-Tool Tool--Call shimmer">
                              <LoadingIcon className="DocSearch-AskAiScreen-SmallerLoadingIcon" />
                              <span>Searching through the docs for "{toolInvocation.args?.query || ''}" ...</span>
                            </div>
                          );
                        case 'result':
                          return (
                            <div key={index} className="DocSearch-AskAiScreen-MessageContent-Tool Tool--Result">
                              <SearchIcon size={16} />
                              <span>Looked through the docs for "{toolInvocation.args?.query || ''}"</span>
                            </div>
                          );
                        default:
                          return null;
                      }
                    }
                    // fallback for unknown tool
                    return (
                      <span key={index} className="text-sm italic">
                        Thinking...
                      </span>
                    );
                  }
                  // fallback for unknown part type
                  return null;
                })
              : assistantMessage?.content}
          </div>
        </div>
        <div className="DocSearch-AskAiScreen-Answer-Footer">
          <AskAiScreenFooterActions
            showActions={showActions}
            latestAssistantMessageContent={assistantMessage?.content || null}
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
  showActions: boolean;
  latestAssistantMessageContent: string | null;
}

function AskAiScreenFooterActions({
  showActions,
  latestAssistantMessageContent,
}: AskAiScreenFooterActionsProps): JSX.Element | null {
  if (!showActions || !latestAssistantMessageContent) {
    return null;
  }
  return (
    <div className="DocSearch-AskAiScreen-Actions">
      <CopyButton onClick={() => navigator.clipboard.writeText(latestAssistantMessageContent)} />
      <LikeButton />
      <DislikeButton />
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
  const {
    disclaimerText = 'Answers are generated using artificial intelligence. This is an experimental technology, and information may occasionally be incorrect or misleading.',
  } = translations;

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

  return (
    <div className="DocSearch-AskAiScreen DocSearch-AskAiScreen-Container">
      <div className="DocSearch-AskAiScreen-Body">
        <div className="DocSearch-AskAiScreen-ExchangesList">
          {exchanges
            .slice()
            .reverse()
            .map((exchange, index) => (
              <AskAiExchangeCard
                key={exchange.id}
                exchange={exchange}
                isLastExchange={index === 0}
                loadingStatus={props.status}
                translations={translations}
              />
            ))}
        </div>
      </div>
      <AskAiScreenHeader disclaimerText={disclaimerText} />
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

function CopyButton({ onClick }: { onClick: () => void }): JSX.Element {
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

function LikeButton(): JSX.Element {
  // @todo: implement like button
  return (
    <button type="button" className="DocSearch-AskAiScreen-ActionButton DocSearch-AskAiScreen-LikeButton">
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

function DislikeButton(): JSX.Element {
  // @todo: implement dislike button
  return (
    <button type="button" className="DocSearch-AskAiScreen-ActionButton DocSearch-AskAiScreen-DislikeButton">
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
