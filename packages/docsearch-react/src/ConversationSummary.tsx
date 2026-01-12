import type { JSX } from 'react';
import React from 'react';

import { SparklesIcon } from './icons';
import { MemoizedMarkdown } from './MemoizedMarkdown';

export type ConversationSummaryProps = {
  summary: string;
  translations?: {
    summaryTitle?: string;
  } | null;
};

export function ConversationSummary({ summary, translations }: ConversationSummaryProps): JSX.Element {
  return (
    <div className="DocSearch-ConversationSummary">
      <div className="DocSearch-ConversationSummary-title">
        <SparklesIcon />
        <span>{translations?.summaryTitle || 'Summary'}</span>
      </div>
      <div className="DocSearch-ConversationSummary-content">
        <MemoizedMarkdown content={summary} copyButtonText="" copyButtonCopiedText="" isStreaming={false} />
      </div>
    </div>
  );
}
