import type { JSX } from 'react';
import React from 'react';

import type { SuggestedQuestionHit } from '../types';

export type NewConversationScreenTranslations = Partial<{
  /**
   * Title to be shown on the new conversation/starting screen.
   **/
  titleText: string;
  /**
   * Introduction text displayed on the new conversation/starting screen.
   **/
  introductionText: string;
}>;

type NewConversationScreenProps = {
  suggestedQuestions: SuggestedQuestionHit[];
  onSelectQuestion: (question: SuggestedQuestionHit) => void;
  translations?: NewConversationScreenTranslations;
};

export const NewConversationScreen = ({
  suggestedQuestions,
  onSelectQuestion,
  translations = {},
}: NewConversationScreenProps): JSX.Element => {
  const {
    titleText = 'How can I help you today?',
    introductionText = 'I search through your documentation to help you find setup guides, feature details and troubleshooting tips, fast.',
  } = translations;

  return (
    <div className="DocSearch-Sidepanel-NewConversationScreen">
      <h4 className="DocSearch-Sidepanel-Screen--title">{titleText}</h4>
      <p className="DocSearch-Sidepanel-Screen--introduction">{introductionText}</p>

      <div className="DocSearch-Sidepanel-List">
        {suggestedQuestions.map((q) => (
          <button
            key={q.objectID}
            type="button"
            className="DocSearch-Sidepanel-SuggestedQuestion"
            onClick={() => {
              onSelectQuestion(q);
            }}
          >
            <span>{q.question}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
