/**
 * Categories a user can select when submitting negative (thumbs down) feedback
 * on an AI chat message.
 */
export type AskAiFeedbackReason =
  | 'incorrect'
  | 'not_what_i_asked'
  | 'other'
  | 'safety_or_legal'
  | 'slow_or_buggy'
  | 'style_or_tone';

/**
 * Payload sent when a user submits feedback on an AI chat message.
 * `tags` and `notes` are only present for negative feedback.
 */
export type AskAiFeedbackPayload = {
  /** 1 for a thumbs up, 0 for a thumbs down. */
  thumbs: 0 | 1;
  /** Optional reason categories, only collected for negative feedback. */
  tags?: AskAiFeedbackReason[];
  /** Optional free-text note, only collected for negative feedback. */
  notes?: string;
};

/**
 * Callback invoked when a user submits feedback on an AI chat message.
 */
export type OnAskAiFeedback = (messageId: string, feedback: AskAiFeedbackPayload) => Promise<void>;
