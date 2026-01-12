import type { JSX } from 'react';
import React from 'react';

import type { AskAiScreenTranslations } from './AskAiScreen';
import { SparklesIcon } from './icons';
import { MemoizedMarkdown } from './MemoizedMarkdown';

export type ConversationSummaryProps = {
  summary: string;
  translations: AskAiScreenTranslations;
};

export function ConversationSummary({ summary, translations }: ConversationSummaryProps): JSX.Element {
  const { conversationSummaryTitle = 'Summary' } = translations;

  return (
    <div className="DocSearch-ConversationSummary">
      <div className="DocSearch-ConversationSummary-title">
        <SparklesIcon />
        <span>{conversationSummaryTitle}</span>
      </div>
      <div className="DocSearch-ConversationSummary-content">
        <MemoizedMarkdown content={summary} copyButtonText="" copyButtonCopiedText="" isStreaming={false} />
      </div>
    </div>
  );
}
