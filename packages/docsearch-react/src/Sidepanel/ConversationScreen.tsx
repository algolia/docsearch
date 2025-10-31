import type { UseChatHelpers } from '@ai-sdk/react';
import type { JSX } from 'react';
import React, { memo, useMemo } from 'react';

import { AskAiScreenFooterActions, AskAiSourcesPanel, type Exchange } from '../AskAiScreen';
import { AlertIcon, LoadingIcon, SearchIcon } from '../icons';
import { MemoizedMarkdown } from '../MemoizedMarkdown';
import type { StoredSearchPlugin } from '../stored-searches';
import type { StoredAskAiState } from '../types';
import type { AIMessage } from '../types/AskiAi';
import { extractLinksFromMessage, getMessageContent } from '../utils/ai';
import { groupConsecutiveToolResults } from '../utils/groupConsecutiveToolResults';

import { AggregatedSearchBlock } from './AggregatedSearchBlock';

export type ConversationScreenTranslations = Partial<{
  /**
   * Text shown while assistant is reasoning.
   */
  reasoningText: string;
  /**
   * Text show while assistant is thinking.
   */
  thinkingText: string;
  /**
   * Text shown while assistant is preparing tool call.
   */
  preToolCallText: string;
  /**
   * Text shown while assistant is performing search tool call.
   */
  searchingText: string;
  /**
   * Text shown while assistant is finished performing tool call.
   */
  toolCallResultText: string;
  /**
   * Text shown describing related sources.
   */
  relatedSourcesText: string;
  /**
   * Message that's shown when user has stopped the streaming of a message.
   */
  stoppedStreamingText: string;
  /**
   * Text shown for copy button on code snippets.
   **/
  copyButtonText: string;
  /**
   * Message shown after clicking copy.
   **/
  copyButtonCopiedText: string;
  /**
   * Title for thumbs up feedback icon.
   **/
  likeButtonTitle: string;
  /**
   * Title for thumbs down feedback icon.
   **/
  dislikeButtonTitle: string;
  /**
   * Message displayed after feedback action.
   **/
  thanksForFeedbackText: string;
}>;

export type ConversationScreenProps = {
  exchanges: Exchange[];
  conversations: StoredSearchPlugin<StoredAskAiState>;
  translations?: ConversationScreenTranslations;
  status: UseChatHelpers<AIMessage>['status'];
  handleFeedback?: (messageId: string, thumbs: 0 | 1) => Promise<void>;
  streamError: Error | null;
};

const ConversationExchange = ({
  exchange,
  translations = {},
  isLastExchange,
  conversations,
  onFeedback,
  status,
  streamError,
}: {
  exchange: Exchange;
  isLastExchange: boolean;
  status: ConversationScreenProps['status'];
  conversations: ConversationScreenProps['conversations'];
  translations?: ConversationScreenTranslations;
  onFeedback?: ConversationScreenProps['handleFeedback'];
  streamError: ConversationScreenProps['streamError'];
}): JSX.Element => {
  const { userMessage, assistantMessage } = exchange;

  const {
    reasoningText = 'Reasoning...',
    thinkingText = 'Thinking...',
    searchingText = 'Searching...',
    relatedSourcesText = 'Related sources',
    stoppedStreamingText = 'You stopped this response',
    preToolCallText = 'Searching...',
    toolCallResultText = 'Searched for',
    copyButtonText = 'Copy',
    copyButtonCopiedText = 'Copied!',
  } = translations;

  const assistantContent = useMemo(() => getMessageContent(assistantMessage), [assistantMessage]);
  const userContent = useMemo(() => getMessageContent(userMessage), [userMessage]);

  const assistantParts = useMemo(() => groupConsecutiveToolResults(assistantMessage?.parts || []), [assistantMessage]);
  const urlsToDisplay = React.useMemo(() => extractLinksFromMessage(assistantMessage), [assistantMessage]);

  const wasStopped = userMessage.metadata?.stopped || assistantMessage?.metadata?.stopped;
  const isThinking = !assistantParts.some((part) => part.type !== 'step-start');
  const showActions =
    !wasStopped && (!isLastExchange || (isLastExchange && status === 'ready' && Boolean(assistantMessage)));

  return (
    <div className="DocSearch-AskAiScreen-Response-Container">
      <div className="DocSearch-AskAiScreen-Response">
        <div className="DocSearch-AskAiScreen-Message DocSearch-AskAiScreen-Message--user">
          <p className="DocSearch-AskAiScreen-Query">{userContent?.text ?? ''}</p>
        </div>
        <div className="DocSearch-AskAiScreen-Message DocSearch-AskAiScreen-Message--assistant">
          <div className="DocSearch-AskAiScreen-MessageContent">
            {status === 'error' && streamError && isLastExchange && (
              <div className="DocSearch-AskAiScreen-MessageContent DocSearch-AskAiScreen-Error">
                <AlertIcon />
                <MemoizedMarkdown
                  content={streamError.message}
                  copyButtonText=""
                  copyButtonCopiedText=""
                  isStreaming={false}
                />
              </div>
            )}

            {assistantParts.map((part, idx) => {
              const index = idx;

              if (part.type === 'reasoning' && part.state === 'streaming') {
                return (
                  <div key={index} className="DocSearch-AskAiScreen-MessageContent-Reasoning shimmer">
                    <LoadingIcon className="DocSearch-AskAiScreen-SmallerLoadingIcon" />
                    <span className="shimmer">{reasoningText}</span>
                  </div>
                );
              }

              if (part.type === 'aggregated-tool-call') {
                return <AggregatedSearchBlock key={index} queries={part.queries} />;
              }

              if (part.type === 'tool-searchIndex') {
                switch (part.state) {
                  case 'input-streaming':
                    return (
                      <div key={index} className="DocSearch-AskAiScreen-MessageContent-Tool Tool--PartialCall shimmer">
                        <LoadingIcon className="DocSearch-AskAiScreen-SmallerLoadingIcon" />
                        <span>{searchingText}</span>
                      </div>
                    );
                  case 'input-available':
                    return (
                      <div key={index} className="DocSearch-AskAiScreen-MessageContent-Tool Tool--Call shimmer">
                        <LoadingIcon className="DocSearch-AskAiScreen-SmallerLoadingIcon" />
                        <span>
                          {preToolCallText} {`"${part.input.query || ''}" ...`}
                        </span>
                      </div>
                    );
                  case 'output-available':
                    return (
                      <div key={index} className="DocSearch-AskAiScreen-MessageContent-Tool Tool--Result">
                        <SearchIcon />
                        <span>
                          {toolCallResultText}{' '}
                          <span className="DocSearch-AskAiScreen-MessageContent-Tool-Query">
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

              if (typeof part === 'string') {
                return (
                  <MemoizedMarkdown
                    key={index}
                    content={part}
                    copyButtonText={copyButtonText}
                    copyButtonCopiedText={copyButtonCopiedText}
                    isStreaming={false}
                  />
                );
              }

              if (part.type === 'text') {
                return (
                  <MemoizedMarkdown
                    key={index}
                    content={part.text}
                    copyButtonText={copyButtonText}
                    copyButtonCopiedText={copyButtonCopiedText}
                    isStreaming={part.state === 'streaming'}
                  />
                );
              }

              return null;
            })}

            {isThinking && isLastExchange && assistantParts.length === 0 && (
              <div className="DocSearch-AskAiScreen-MessageContent-Reasoning">
                <span className="shimmer">{thinkingText}</span>
              </div>
            )}
          </div>

          {wasStopped && <p className="DocSearck-AskAiScreen-MessageContent-Stopped">{stoppedStreamingText}</p>}
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

      {urlsToDisplay.length > 0 ? (
        <AskAiSourcesPanel urlsToDisplay={urlsToDisplay} relatedSourcesText={relatedSourcesText} />
      ) : null}
    </div>
  );
};

export const ConversationScreen = memo(
  ({ exchanges, translations = {}, handleFeedback, ...props }: ConversationScreenProps): JSX.Element => {
    return (
      <div className="DocSearch-Sidepanel-ConversationScreen">
        {exchanges
          .slice()
          .reverse()
          .map((exchange, idx) => (
            <ConversationExchange
              key={exchange.id}
              exchange={exchange}
              translations={translations}
              isLastExchange={idx === 0}
              onFeedback={handleFeedback}
              {...props}
            />
          ))}
      </div>
    );
  },
);
