import React, { type JSX } from 'react';

export type NewConversationTranslations = Partial<{
  newConversationTitle: string;
  newConversationDescription: string;
}>;

type SuggestedQuestion = {
  text: string;
};

interface NewConversationProps {
  suggestedQuestions?: SuggestedQuestion[];
  selectSuggestedQuestion: (query: string) => void;
  translations?: NewConversationTranslations;
}

const testSuggestedQuestions = [
  {
    text: 'What is Astro?',
  },
  {
    text: 'How can I deploy my Astro site?',
  },
];

export function NewConversationScreen({
  translations = {},
  suggestedQuestions = testSuggestedQuestions,
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
        {suggestedQuestions.map((question, idx) => (
          <button
            key={idx}
            type="button"
            className="DocSearch-NewConversationScreen-SuggestedQuestion"
            onClick={() => selectSuggestedQuestion(question.text)}
          >
            {question.text}
          </button>
        ))}
      </div>
    </div>
  );
}
