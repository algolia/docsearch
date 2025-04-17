import React, { type JSX } from 'react';

export type AskAiScreenTranslations = Partial<{
  titleText: string;
  helpText: string;
}>;

type AskAiScreenProps = {
  translations?: AskAiScreenTranslations;
};

// @todo: ask ai screen
export function AskAiScreen({ translations = {} }: AskAiScreenProps): JSX.Element {
  const { titleText = 'Welcome to Ask AI', helpText = 'Ask me anything about your documentation.' } = translations;
  return (
    <div className="DocSearch-AskAiScreen">
      <div className="DocSearch-Screen-Icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="140"
          height="140"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.75"
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
      </div>
      <p className="DocSearch-Title">{titleText}</p>
      <p className="DocSearch-Help">{helpText}</p>
    </div>
  );
}
