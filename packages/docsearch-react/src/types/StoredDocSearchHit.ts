import type { AIMessage } from './AskiAi';
import type { DocSearchHit } from './DocSearchHit';
import type { AskAiFeedbackReason } from './Feedback';

export type StoredDocSearchHit = Omit<DocSearchHit, '_highlightResult' | '_snippetResult'>;

export type StoredAskAiMessage = AIMessage & {
  /** Optional user feedback on this assistant message. */
  feedback?: 'dislike' | 'like';
  /** Optional reason categories submitted with negative feedback. */
  feedbackTags?: AskAiFeedbackReason[];
  /** Optional free-text note submitted with negative feedback. */
  feedbackNotes?: string;
};

export type StoredAskAiState = StoredDocSearchHit & {
  stopped?: boolean;
  messages?: StoredAskAiMessage[];
};
