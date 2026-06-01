import React, { type JSX, useEffect, useState } from 'react';

import { LoadingIcon } from '../icons';
import type { StoredSearchPlugin } from '../stored-searches';
import type { AskAiFeedbackReason, OnAskAiFeedback, StoredAskAiState } from '../types';

export type FeedbackActionsTranslations = Partial<{
  /** Tooltip/aria-label for the button that copies the assistant's answer to the clipboard. */
  copyButtonTitle: string;
  /** Transient confirmation label shown on the copy button right after a successful copy. */
  copyButtonCopiedText: string;
  /** Tooltip/aria-label for the thumbs-up (positive feedback) button. */
  likeButtonTitle: string;
  /** Tooltip/aria-label for the thumbs-down (negative feedback) button that opens the notes form. */
  dislikeButtonTitle: string;
  /** Confirmation message shown after feedback has been submitted. */
  thanksForFeedbackText: string;
  /** Heading displayed at the top of the negative feedback form (e.g. "What went wrong?"). */
  feedbackPanelTitle: string;
  /** Placeholder text for the free-form notes textarea in the negative feedback form. */
  feedbackDetailsPlaceholder: string;
  /** Label for the button that submits the negative feedback form. */
  feedbackSubmitButtonText: string;
  /** Label for the button that cancels/dismisses the negative feedback form. */
  feedbackCancelButtonText: string;
  /** Tooltip/aria-label for the button that closes/cancels the negative feedback form. */
  feedbackCloseButtonTitle: string;
  /** Label for the "Incorrect or incomplete" tag. */
  feedbackTagIncorrect: string;
  /** Label for the "Not what I asked for" tag. */
  feedbackTagNotWhatIAsked: string;
  /** Label for the "Slow or buggy" tag. */
  feedbackTagSlowOrBuggy: string;
  /** Label for the "Style or tone" tag. */
  feedbackTagStyleOrTone: string;
  /** Label for the "Safety or legal concern" tag. */
  feedbackTagSafetyOrLegal: string;
  /** Label for the "Other" tag. */
  feedbackTagOther: string;
}>;

type TagTranslationKey = Extract<keyof FeedbackActionsTranslations, `feedbackTag${string}`>;

type FeedbackReasonOption = {
  value: AskAiFeedbackReason;
  translationKey: TagTranslationKey;
  defaultLabel: string;
};

// Hoisted at module level so the array identity is stable across renders.
const FEEDBACK_REASONS: FeedbackReasonOption[] = [
  {
    value: 'incorrect',
    translationKey: 'feedbackTagIncorrect',
    defaultLabel: 'Incorrect or incomplete',
  },
  {
    value: 'not_what_i_asked',
    translationKey: 'feedbackTagNotWhatIAsked',
    defaultLabel: 'Not what I asked for',
  },
  {
    value: 'slow_or_buggy',
    translationKey: 'feedbackTagSlowOrBuggy',
    defaultLabel: 'Slow or buggy',
  },
  {
    value: 'style_or_tone',
    translationKey: 'feedbackTagStyleOrTone',
    defaultLabel: 'Style or tone',
  },
  {
    value: 'safety_or_legal',
    translationKey: 'feedbackTagSafetyOrLegal',
    defaultLabel: 'Safety or legal concern',
  },
  {
    value: 'other',
    translationKey: 'feedbackTagOther',
    defaultLabel: 'Other',
  },
];

// Maximum number of characters allowed in the feedback notes field.
const MAX_NOTES_LENGTH = 1000;

type FeedbackView = 'actions' | 'note' | 'thanks';

interface FeedbackActionsProps {
  id: string;
  showActions: boolean;
  latestAssistantMessageContent: string | null;
  translations: FeedbackActionsTranslations;
  conversations: StoredSearchPlugin<StoredAskAiState>;
  onFeedback?: OnAskAiFeedback;
  /** When rendered in the Sidepanel the copy button is ordered first. */
  isSidepanel?: boolean;
}

export function FeedbackActions({
  id,
  showActions,
  latestAssistantMessageContent,
  translations,
  conversations,
  onFeedback,
  isSidepanel = false,
}: FeedbackActionsProps): JSX.Element | null {
  // Derive the initial view during render (no effect needed): if feedback was
  // already recorded for this message, jump straight to the "thanks" state.
  const [view, setView] = useState<FeedbackView>(() => {
    const message = conversations.getOne?.(id);
    return message?.feedback ? 'thanks' : 'actions';
  });
  const [tags, setTags] = useState<AskAiFeedbackReason[]>([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [savingError, setSavingError] = useState<Error | null>(null);

  const {
    likeButtonTitle = 'Like',
    dislikeButtonTitle = 'Dislike',
    thanksForFeedbackText = 'Thanks for your feedback!',
  } = translations;

  const handleLike = async (): Promise<void> => {
    if (saving) return;
    setSavingError(null);
    setSaving(true);
    try {
      await onFeedback?.(id, { thumbs: 1 });
      setView('thanks');
    } catch (error) {
      setSavingError(error as Error);
    } finally {
      setSaving(false);
    }
  };

  const handleDislike = (): void => {
    setSavingError(null);
    setView('note');
  };

  const handleToggleTag = (value: AskAiFeedbackReason): void => {
    setTags((prev) => (prev.includes(value) ? prev.filter((tag) => tag !== value) : [...prev, value]));
  };

  const handleSubmitNote = async (): Promise<void> => {
    if (saving) return;
    setSavingError(null);
    setSaving(true);
    try {
      await onFeedback?.(id, {
        thumbs: 0,
        tags: tags.length > 0 ? tags : undefined,
        notes: notes.trim() || undefined,
      });
      setView('thanks');
    } catch (error) {
      setSavingError(error as Error);
    } finally {
      setSaving(false);
    }
  };

  const handleCloseNote = (): void => {
    setTags([]);
    setNotes('');
    setSavingError(null);
    setView('actions');
  };

  if (!showActions || !latestAssistantMessageContent) {
    return null;
  }

  const copyButton = (
    <CopyButton
      translations={translations}
      onClick={() => navigator.clipboard.writeText(latestAssistantMessageContent)}
    />
  );

  return (
    <div className="DocSearch-AskAiScreen-Actions">
      <div className="DocSearch-AskAiScreen-Actions-Controls">
        {isSidepanel ? copyButton : null}

        {view === 'thanks' ? (
          <p className="DocSearch-AskAiScreen-FeedbackText DocSearch-AskAiScreen-FeedbackText--visible">
            {thanksForFeedbackText}
          </p>
        ) : (
          <>
            {saving && view === 'actions' ? (
              <LoadingIcon className="DocSearch-AskAiScreen-SmallerLoadingIcon" />
            ) : (
              <>
                <LikeButton title={likeButtonTitle} onClick={handleLike} />
                <DislikeButton title={dislikeButtonTitle} onClick={handleDislike} />
              </>
            )}
            {savingError && view === 'actions' ? (
              <p className="DocSearch-AskAiScreen-FeedbackText">{savingError.message || 'An error occured'}</p>
            ) : null}
          </>
        )}

        {isSidepanel ? null : copyButton}
      </div>

      {view === 'note' ? (
        <NegativeFeedbackPanel
          translations={translations}
          tags={tags}
          notes={notes}
          saving={saving}
          savingError={savingError}
          onToggleTag={handleToggleTag}
          onNotesChange={setNotes}
          onSubmit={handleSubmitNote}
          onClose={handleCloseNote}
        />
      ) : null}
    </div>
  );
}

interface NegativeFeedbackPanelProps {
  translations: FeedbackActionsTranslations;
  tags: AskAiFeedbackReason[];
  notes: string;
  saving: boolean;
  savingError: Error | null;
  onToggleTag: (tag: AskAiFeedbackReason) => void;
  onNotesChange: (notes: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

function NegativeFeedbackPanel({
  translations,
  tags,
  notes,
  saving,
  savingError,
  onToggleTag,
  onNotesChange,
  onSubmit,
  onClose,
}: NegativeFeedbackPanelProps): JSX.Element {
  const {
    feedbackPanelTitle = 'What went wrong? (optional)',
    feedbackDetailsPlaceholder = 'Share some details...',
    feedbackSubmitButtonText = 'Submit',
    feedbackCancelButtonText = 'Cancel',
  } = translations;

  return (
    <div className="DocSearch-Feedback-Panel" role="group" aria-label={feedbackPanelTitle}>
      <div className="DocSearch-Feedback-Panel-Header">
        <p className="DocSearch-Feedback-Panel-Title">{feedbackPanelTitle}</p>
      </div>

      <div className="DocSearch-Feedback-Panel-Reasons">
        {FEEDBACK_REASONS.map((reason) => {
          const isSelected = tags.includes(reason.value);
          return (
            <button
              key={reason.value}
              type="button"
              className={`DocSearch-Feedback-Panel-Reason${
                isSelected ? ' DocSearch-Feedback-Panel-Reason--selected' : ''
              }`}
              aria-pressed={isSelected}
              onClick={() => onToggleTag(reason.value)}
            >
              <span>{translations[reason.translationKey] ?? reason.defaultLabel}</span>
            </button>
          );
        })}
      </div>

      <textarea
        className="DocSearch-Feedback-Panel-Textarea"
        placeholder={feedbackDetailsPlaceholder}
        value={notes}
        rows={3}
        maxLength={MAX_NOTES_LENGTH}
        onChange={(event) => onNotesChange(event.target.value.slice(0, MAX_NOTES_LENGTH))}
      />

      <p className="DocSearch-Feedback-Panel-CharCount" aria-live="polite">
        {notes.length}/{MAX_NOTES_LENGTH}
      </p>

      {savingError ? (
        <p className="DocSearch-Feedback-Panel-Error">{savingError.message || 'An error occured'}</p>
      ) : null}

      <div className="DocSearch-Feedback-Panel-Actions">
        <button type="button" className="DocSearch-Feedback-Panel-Cancel" onClick={onClose}>
          {feedbackCancelButtonText}
        </button>
        <button type="button" className="DocSearch-Feedback-Panel-Submit" disabled={saving} onClick={onSubmit}>
          {saving ? <LoadingIcon className="DocSearch-AskAiScreen-SmallerLoadingIcon" /> : feedbackSubmitButtonText}
        </button>
      </div>
    </div>
  );
}

export function CopyButton({
  onClick,
  translations,
}: {
  onClick: () => void;
  translations: FeedbackActionsTranslations;
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
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      )}
    </button>
  );
}

export function LikeButton({ title, onClick }: { title: string; onClick: () => void }): JSX.Element {
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
      >
        <path d="M7 10v12" />
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
      </svg>
    </button>
  );
}

export function DislikeButton({ title, onClick }: { title: string; onClick: () => void }): JSX.Element {
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
      >
        <path d="M17 14V2" />
        <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
      </svg>
    </button>
  );
}
