import React, { type JSX } from 'react';

import type { SuggestedQuestionHit } from './types';

export type NewConversationTranslations = Partial<{
  newConversationTitle: string;
  newConversationDescription: string;
}>;

interface NewConversationProps {
  suggestedQuestions?: SuggestedQuestionHit[];
  selectSuggestedQuestion: (question: SuggestedQuestionHit) => void;
  translations?: NewConversationTranslations;
}

export function NewConversationScreen({
  translations = {},
  suggestedQuestions = [],
  selectSuggestedQuestion,
}: NewConversationProps): JSX.Element {
  const {
    newConversationTitle = 'How can I help you today?',
    newConversationDescription = 'I search through your documentation to help you find setup guides, feature details and troubleshooting tips, fast.',
  } = translations;

  return (
    <div className="DocSearch-NewConversationScreen">
      <h3 className="DocSearch-NewConversationScreen-Title">{newConversationTitle}</h3>
      <p className="DocSearch-NewConversationScreen-Description">{newConversationDescription}</p>

      <div className="DocSearch-NewConversationScreen-SuggestedQuestions">
        {suggestedQuestions.map((question) => (
          <button
            key={question.objectID}
            type="button"
            className="DocSearch-NewConversationScreen-SuggestedQuestion"
            onClick={() => selectSuggestedQuestion(question)}
          >
            {question.question}
          </button>
        ))}
      </div>
    </div>
  );
}
