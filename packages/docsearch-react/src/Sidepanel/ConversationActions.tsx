import type { JSX } from 'react';
import React from 'react';

import { CopyButton, DislikeButton, LikeButton, type AskAiScreenTranslations } from '../AskAiScreen';
import { LoadingIcon } from '../icons';
import type { StoredSearchPlugin } from '../stored-searches';
import type { StoredAskAiState } from '../types';

interface ConversationActionsProps {
  id: string;
  showActions: boolean;
  latestAssistantMessageContent: string | null;
  translations: AskAiScreenTranslations;
  conversations: StoredSearchPlugin<StoredAskAiState>;
  onFeedback?: (messageId: string, thumbs: 0 | 1) => Promise<void>;
  isSidepanel?: boolean;
  agentStudio?: boolean;
}

export function ConversationActions({
  translations,
  conversations,
  id,
  onFeedback,
  latestAssistantMessageContent,
  showActions,
  agentStudio,
}: ConversationActionsProps): JSX.Element | null {
  const initialFeedback = React.useMemo(() => {
    const message = conversations.getOne?.(id);
    return message?.feedback ?? null;
  }, [conversations, id]);

  const [feedback, setFeedback] = React.useState<'dislike' | 'like' | null>(initialFeedback);
  const [saving, setSaving] = React.useState(false);
  const [savingError, setSavingError] = React.useState<Error | null>(null);

  const handleFeedback = async (value: 'dislike' | 'like'): Promise<void> => {
    if (saving) return;
    setSavingError(null);
    setSaving(true);
    try {
      await onFeedback?.(id, value === 'like' ? 1 : 0);
      setFeedback(value);
    } catch (error) {
      setSavingError(error as Error);
    } finally {
      setSaving(false);
    }
  };

  const {
    likeButtonTitle = 'Like',
    dislikeButtonTitle = 'Dislike',
    thanksForFeedbackText = 'Thanks for your feedback!',
  } = translations;

  if (!showActions || !latestAssistantMessageContent) {
    return null;
  }

  return (
    <div className="DocSearch-AskAiScreen-Actions">
      <CopyButton
        translations={translations}
        onClick={() => navigator.clipboard.writeText(latestAssistantMessageContent)}
      />
      {!agentStudio &&
        (feedback === null ? (
          <>
            {saving ? (
              <LoadingIcon className="DocSearch-AskAiScreen-SmallerLoadingIcon" />
            ) : (
              <>
                <LikeButton title={likeButtonTitle} onClick={() => handleFeedback('like')} />
                <DislikeButton title={dislikeButtonTitle} onClick={() => handleFeedback('dislike')} />
              </>
            )}
            {savingError && (
              <p className="DocSearch-AskAiScreen-FeedbackText">{savingError.message || 'An error occured'}</p>
            )}
          </>
        ) : (
          <p className="DocSearch-AskAiScreen-FeedbackText DocSearch-AskAiScreen-FeedbackText--visible">
            {thanksForFeedbackText}
          </p>
        ))}
    </div>
  );
}
