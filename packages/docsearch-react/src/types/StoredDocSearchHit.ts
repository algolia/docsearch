import type { AIMessage } from './AskiAi';
import type { DocSearchHit } from './DocSearchHit';

export type StoredDocSearchHit = Omit<DocSearchHit, '_highlightResult' | '_snippetResult'>;

export type StoredAskAiMessage = AIMessage & {
  /** Optional user feedback on this assistant message. */
  feedback?: 'dislike' | 'like';
};

export type StoredAskAiState = Omit<DocSearchHit, '_highlightResult' | '_snippetResult'> & {
  messages?: StoredAskAiMessage[];
};
