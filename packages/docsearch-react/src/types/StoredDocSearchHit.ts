import type { Message } from '@ai-sdk/react';

import type { DocSearchHit } from './DocSearchHit';

export type StoredDocSearchHit = Omit<DocSearchHit, '_highlightResult' | '_snippetResult'>;

export type StoredAskAiMessage = Message & {
  /** Optional user feedback on this assistant message. */
  feedback?: 'dislike' | 'like';
};

export type StoredAskAiState = Omit<DocSearchHit, '_highlightResult' | '_snippetResult'> & {
  messages?: StoredAskAiMessage[];
};
