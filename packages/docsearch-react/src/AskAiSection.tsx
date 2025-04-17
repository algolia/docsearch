import React from 'react';

export type AskAIButtonTranslations = Partial<{
  buttonText: string;
  buttonAriaLabel: string;
  askPlaceholder: string;
}>;

export type AskAISectionProps = React.ComponentProps<'button'> & {
  onAskAiToggle: (toggle: boolean) => void;
  translations?: AskAIButtonTranslations;
  query?: string;
  icon?: React.ReactNode;
};

export const AskAISection = React.forwardRef<HTMLButtonElement, AskAISectionProps>(
  ({ translations = {}, query = '', icon, onAskAiToggle, ...props }, ref) => {
    const { buttonAriaLabel = 'Ask AI', askPlaceholder = 'Ask AI:' } = translations;

    const defaultIcon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-sparkles-icon lucide-sparkles"
      >
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        <path d="M20 3v4" />
        <path d="M22 5h-4" />
        <path d="M4 17v2" />
        <path d="M5 18H3" />
      </svg>
    );

    return (
      <section className="DocSearch-AskAi-Section">
        <button
          id="DocSearch-AskAIButton"
          className="DocSearch-Hit-AskAIButton"
          type="button"
          tabIndex={0}
          aria-label={buttonAriaLabel}
          ref={ref}
          onClick={() => onAskAiToggle(true)}
          {...props}
        >
          <div className="DocSearch-Hit-AskAIButton-Container">
            <div className="DocSearch-Hit-AskAIButton-icon">{icon || defaultIcon}</div>
            <div className="DocSearch-Hit-AskAIButton-title">
              <span className="DocSearch-Hit-AskAIButton-title-highlight">{askPlaceholder}</span>
              <span className="DocSearch-Hit-AskAIButton-title-query">"{query}"</span>
            </div>
            <div className="DocSearch-Hit-AskAIButton-actions">
              <svg className="DocSearch-Hit-AskAIButton-action-icon" viewBox="0 0 24 24">
                <path d="M12 2L2 22h20L12 2z" />
              </svg>
            </div>
          </div>
        </button>
      </section>
    );
  },
);

AskAISection.displayName = 'AskAISection';
