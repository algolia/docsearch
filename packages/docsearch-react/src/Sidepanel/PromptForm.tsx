import React from 'react';
import type { JSX } from 'react';

import type { Exchange } from '../AskAiScreen';
import { SendIcon, StopIcon } from '../icons';
import { useIsMobile } from '../useIsMobile';

export type PromptFormTranslations = Partial<{
  /**
   * Initial placeholder for the prompt input.
   **/
  promptPlaceholderText: string;
  /**
   * Placeholder text for wile a conversation is streaming.
   **/
  promptAnsweringText: string;
  /**
   * Placeholder text for after a question has already been asked.
   **/
  promptAskAnotherQuestionText: string;
  /**
   * Disclaimer text displayed beneath the prompt form.
   **/
  promptDisclaimerText: string;
  /**
   * Visually hidden label text (`aria-labelledby`); usually keyboard hints for the textarea.
   **/
  promptLabelText: string;
  /**
   * Accessible name for the textarea (`aria-label`).
   **/
  promptAriaLabelText: string;
  /**
   * Placeholder when the conversation hit the thread depth limit (AI-217).
   **/
  threadDepthErrorPlaceholder: string;
  /**
   * Button label in the blocking-error banner to start a new conversation.
   **/
  startNewConversationButtonText: string;
  /**
   * Trailing sentence fragment after the button in the thread-depth banner (e.g. "to continue.").
   **/
  threadDepthBannerContinueText: string;
}>;

type Props = {
  exchanges: Exchange[];
  isStreaming: boolean;
  translations?: PromptFormTranslations;
  onSend: (prompt: string) => void;
  onStopStreaming: () => void;
  showThreadDepthBanner: boolean;
  threadDepthApiMessage?: string;
  /** If false, the banner shows only the API message (for example, token output limit). */
  showBlockingBannerNewConversationLink?: boolean;
  onStartNewConversation: () => void;
};

const MAX_PROMPT_ROWS = 8;

export const PromptForm = React.forwardRef<HTMLTextAreaElement, Props>(
  (
    {
      exchanges,
      isStreaming,
      translations = {},
      onSend,
      onStopStreaming,
      showThreadDepthBanner,
      threadDepthApiMessage,
      showBlockingBannerNewConversationLink = true,
      onStartNewConversation,
    },
    ref,
  ): JSX.Element => {
    const isMobile = useIsMobile();
    const [userPrompt, setUserPrompt] = React.useState('');
    const promptRef = React.useRef<HTMLTextAreaElement>(null);

    React.useImperativeHandle(ref, () => promptRef.current as HTMLTextAreaElement);

    const {
      promptPlaceholderText = 'Ask a question',
      promptAnsweringText = 'Answering...',
      promptAskAnotherQuestionText = 'Ask another question',
      promptDisclaimerText = 'Answers are generated with AI which can make mistakes.',
      promptLabelText = 'Press Enter to send, or Shift and Enter for new line.',
      promptAriaLabelText = 'Prompt input',
      threadDepthErrorPlaceholder = 'Conversation limit reached',
      startNewConversationButtonText = 'Start a new conversation',
      threadDepthBannerContinueText = 'to continue.',
    } = translations;

    const managePromptHeight = (): void => {
      if (!promptRef.current) return;

      const textArea = promptRef.current;
      const styles = getComputedStyle(textArea);

      const lineHeight = parseFloat(styles.lineHeight);
      const paddingTop = parseFloat(styles.paddingTop);
      const paddingBottom = parseFloat(styles.paddingBottom);
      const padding = paddingTop + paddingBottom;

      textArea.style.height = 'auto';

      const fullHeight = textArea.scrollHeight;
      const maxHeight = MAX_PROMPT_ROWS * lineHeight + padding;

      textArea.style.overflowY = fullHeight > maxHeight ? 'auto' : 'hidden';
      textArea.style.height = `${Math.min(fullHeight, maxHeight)}px`;
    };

    const handleSend = (): void => {
      if (isStreaming || showThreadDepthBanner) return;

      const prompt = userPrompt.trim();

      if (prompt === '') return;

      onSend(prompt);

      setUserPrompt('');

      requestAnimationFrame(() => {
        promptRef.current?.focus();

        managePromptHeight();
      });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
      // Allow Enter to work normally (new line) when streaming
      if (isStreaming || showThreadDepthBanner) return;

      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();

        handleSend();
      }
    };

    React.useLayoutEffect(() => {
      managePromptHeight();
    }, [isMobile]);

    let promptPlaceholder = promptPlaceholderText;

    if (showThreadDepthBanner) {
      promptPlaceholder = threadDepthErrorPlaceholder;
    } else if (isStreaming) {
      promptPlaceholder = promptAnsweringText;
    } else if (exchanges.length > 0) {
      promptPlaceholder = promptAskAnotherQuestionText;
    }

    return (
      <div className="DocSearch-Sidepanel-Prompt">
        {showThreadDepthBanner ? (
          <div className="DocSearch-Sidepanel-ThreadDepthBanner">
            {threadDepthApiMessage ? (
              <p className="DocSearch-Sidepanel-ThreadDepthBanner-apiMessage">{threadDepthApiMessage}</p>
            ) : null}
            {showBlockingBannerNewConversationLink ? (
              <p>
                <button type="button" className="DocSearch-ThreadDepthError-Link" onClick={onStartNewConversation}>
                  {startNewConversationButtonText}
                </button>{' '}
                {threadDepthBannerContinueText}
              </p>
            ) : null}
          </div>
        ) : null}
        {!showThreadDepthBanner ? (
          <form
            className="DocSearch-Sidepanel-Prompt--form"
            onSubmit={(e) => {
              e.preventDefault();

              if (isStreaming) return;

              handleSend();
            }}
          >
            <textarea
              ref={promptRef}
              placeholder={promptPlaceholder}
              className="DocSearch-Sidepanel-Prompt--textarea"
              value={userPrompt}
              aria-label={promptAriaLabelText}
              aria-labelledby="prompt-label"
              autoComplete="off"
              translate="no"
              rows={isMobile ? 1 : 2}
              onKeyDown={handleKeyDown}
              onInput={managePromptHeight}
              onChange={(e) => setUserPrompt(e.target.value)}
            />
            <span id="prompt-label" className="sr-only">
              {promptLabelText}
            </span>
            <div className="DocSearch-Sidepanel-Prompt--actions">
              {isStreaming && (
                <button
                  type="button"
                  title="Stop streaming"
                  className="DocSearch-Sidepanel-Prompt--stop"
                  onClick={onStopStreaming}
                >
                  <StopIcon />
                </button>
              )}
              {!isStreaming && (
                <button
                  type="submit"
                  aria-label="Send question"
                  title="Send question"
                  className="DocSearch-Sidepanel-Prompt--submit"
                  aria-disabled={userPrompt === ''}
                >
                  <SendIcon />
                </button>
              )}
            </div>
          </form>
        ) : null}
        <p className="DocSearch-Sidepanel-Prompt--disclaimer">{promptDisclaimerText}</p>
      </div>
    );
  },
);
