import type { JSX } from 'react';
import React from 'react';

interface ConversationPromptSuggestionsProps {
  title: string;
  onSelectPromptSuggestion: (prompt: string) => void;
  suggestions: string[];
}
export const ConversationPromptSuggestions = React.memo(function ConversationPromptSuggestions({
  title,
  suggestions,
  onSelectPromptSuggestion,
}: ConversationPromptSuggestionsProps): JSX.Element {
  const titleId = React.useId();

  const handleSelectPromptSuggestion = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      onSelectPromptSuggestion(e.currentTarget.value);
    },
    [onSelectPromptSuggestion],
  );

  return (
    <section className="DocSearch-PromptSuggestions" aria-labelledby={titleId}>
      <h3 className="DocSearch-PromptSuggestions-Title" id={titleId}>
        {title}
      </h3>
      <div className="DocSearch-PromptSuggestions-Content">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="DocSearch-PromptSuggestions-Action"
            value={suggestion}
            onClick={handleSelectPromptSuggestion}
          >
            {suggestion}
          </button>
        ))}
      </div>
    </section>
  );
});
