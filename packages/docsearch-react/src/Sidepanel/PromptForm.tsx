import type { UseChatHelpers } from '@ai-sdk/react';
import React from 'react';
import type { JSX } from 'react';

import type { Exchange } from '../AskAiScreen';
import { SendIcon, StopIcon } from '../icons';
import type { AIMessage } from '../types/AskiAi';

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
}>;

type Props = {
  exchanges: Exchange[];
  isStreaming: boolean;
  status: UseChatHelpers<AIMessage>['status'];
  translations?: PromptFormTranslations;
  onSend: (prompt: string) => void;
  onStopStreaming: () => void;
};

export const PromptForm = React.memo(
  ({ exchanges, isStreaming, status, translations = {}, onSend, onStopStreaming }: Props): JSX.Element => {
    const [userPrompt, setUserPrompt] = React.useState('');
    const promptRef = React.useRef<HTMLTextAreaElement | null>(null);

    const {
      promptPlaceholderText = 'Ask a question',
      promptAnsweringText = 'Answering...',
      promptAskAnotherQuestionText = 'Ask another question',
      promptDisclaimerText = 'Answers are generated with AI which can make mistakes.',
    } = translations;

    const handleSend = (): void => {
      const prompt = userPrompt.trim();

      if (prompt === '') return;

      onSend(prompt);

      setUserPrompt('');
      requestAnimationFrame(() => promptRef.current?.focus());
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();

        handleSend();
      }
    };

    let promptPlaceholder = promptPlaceholderText;

    if (isStreaming) {
      promptPlaceholder = promptAnsweringText;
    } else if (exchanges.length > 0) {
      promptPlaceholder = promptAskAnotherQuestionText;
    }

    return (
      <div className="DocSearch-Sidepanel-Prompt">
        <form
          className="DocSearch-Sidepanel-Prompt--form"
          onSubmit={(e) => {
            e.preventDefault();

            handleSend();
          }}
        >
          <textarea
            ref={promptRef}
            placeholder={promptPlaceholder}
            className="DocSearch-Sidepanel-Prompt--textarea"
            aria-disabled={isStreaming}
            value={userPrompt}
            onKeyDown={handleKeyDown}
            onChange={(e) => setUserPrompt(e.target.value)}
          />
          <div className="DocSearch-Sidepanel-Prompt--actions">
            {status === 'streaming' && (
              <button type="button" className="DocSearch-Sidepanel-Prompt--stop" onClick={onStopStreaming}>
                <StopIcon />
              </button>
            )}
            {!isStreaming && (
              <button
                type="submit"
                aria-label="Chat"
                className="DocSearch-Sidepanel-Prompt--submit"
                aria-disabled={userPrompt === ''}
              >
                <SendIcon />
              </button>
            )}
          </div>
        </form>
        <p className="DocSearch-Sidepanel-Prompt--disclaimer">{promptDisclaimerText}</p>
      </div>
    );
  },
);
