import type { UseChatHelpers } from '@ai-sdk/react';
import type { JSX } from 'react';
import React, { memo, useMemo } from 'react';

import { AskAiScreenFooterActions, AskAiSourcesPanel, type Exchange } from '../AskAiScreen';
import { LoadingIcon, SearchIcon } from '../icons';
import { MemoizedMarkdown } from '../MemoizedMarkdown';
import type { StoredSearchPlugin } from '../stored-searches';
import type { StoredAskAiState } from '../types';
import type { AIMessage } from '../types/AskiAi';
import { extractLinksFromMessage, getMessageContent } from '../utils/ai';

export type ConversationScreenTranslations = Partial<{
  /**
   * Disclaimer text shown at the top of a conversation.
   */
  conversationDisclaimerText: string;
  /**
   * Text shown while assistant is reasoning.
   */
  reasoningText: string;
  /**
   * Text show while assistant is thinking.
   */
  thinkingText: string;
  /**
   * Text shown while assistant is performing search tool call.
   */
  searchingText: string;
  /**
   * Text shown describing related sources.
   */
  relatedSourcesText: string;
  /**
   * Message that's shown when user has stopped the streaming of a message.
   */
  stoppedStreamingText: string;
}>;

export type ConversationScreenProps = {
  exchanges: Exchange[];
  conversations: StoredSearchPlugin<StoredAskAiState>;
  translations?: ConversationScreenTranslations;
  status: UseChatHelpers<AIMessage>['status'];
  handleFeedback?: (messageId: string, thumbs: 0 | 1) => Promise<void>;
};

const ConversationExchange = ({
  exchange,
  translations = {},
  isLastExchange,
  conversations,
  onFeedback,
  status,
}: {
  exchange: Exchange;
  isLastExchange: boolean;
  status: ConversationScreenProps['status'];
  conversations: ConversationScreenProps['conversations'];
  translations?: ConversationScreenTranslations;
  onFeedback?: ConversationScreenProps['handleFeedback'];
}): JSX.Element => {
  const { userMessage, assistantMessage } = exchange;

  const {
    reasoningText = 'Reasoning...',
    thinkingText = 'Thinking...',
    searchingText = 'Searching...',
    relatedSourcesText = 'Related sources',
    stoppedStreamingText = 'You stopped this response',
  } = translations;

  const assistantContent = useMemo(() => getMessageContent(assistantMessage), [assistantMessage]);
  const userContent = useMemo(() => getMessageContent(userMessage), [userMessage]);

  const assistantParts = useMemo(() => assistantMessage?.parts ?? [], [assistantMessage]);
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
                        <span>Searching for {`"${part.input.query || ''}" ...`}</span>
                      </div>
                    );
                  case 'output-available':
                    return (
                      <div key={index} className="DocSearch-AskAiScreen-MessageContent-Tool Tool--Result">
                        <SearchIcon />
                        <span>
                          Search for
                          <span role="button" tabIndex={0} className="DocSearch-AskAiScreen-MessageContent-Tool-Query">
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
                    copyButtonText={'Copy'}
                    copyButtonCopiedText={'Copied!'}
                    isStreaming={false}
                  />
                );
              }

              if (part.type === 'text') {
                return (
                  <MemoizedMarkdown
                    key={index}
                    content={part.text}
                    copyButtonText={'Copy'}
                    copyButtonCopiedText={'Copied!'}
                    isStreaming={part.state === 'streaming'}
                  />
                );
              }

              return null;
            })}

            {isThinking && (
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
  ({ exchanges, translations = {}, conversations, status, handleFeedback }: ConversationScreenProps): JSX.Element => {
    const { conversationDisclaimerText = 'Answers are generated with AI which can make mistakes. Verify responses.' } =
      translations;

    return (
      <div className="DocSearch-Sidepanel-ConversationScreen">
        <p className="DocSearch-Sidepanel-ConversationScreen--disclaimer">{conversationDisclaimerText}</p>

        {exchanges
          .slice()
          .reverse()
          .map((exchange, idx) => (
            <ConversationExchange
              key={exchange.id}
              exchange={exchange}
              translations={translations}
              isLastExchange={idx === 0}
              conversations={conversations}
              status={status}
              onFeedback={handleFeedback}
            />
          ))}
      </div>
    );
  },
);
