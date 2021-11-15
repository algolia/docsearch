import React from 'react';

import { ErrorIcon } from './icons';

export type ErrorScreenTranslations = Partial<{
  titleText: string;
  helpText: string;
}>;

type ErrorScreenProps = {
  translations?: ErrorScreenTranslations;
};

export function ErrorScreen({ translations = {} }: ErrorScreenProps) {
  const {
    titleText = 'Unable to fetch results',
    helpText = 'You might want to check your network connection.',
  } = translations;
  return (
    <div className="DocSearch-ErrorScreen">
      <div className="DocSearch-Screen-Icon">
        <ErrorIcon />
      </div>
      <p className="DocSearch-Title">{titleText}</p>
      <p className="DocSearch-Help">{helpText}</p>
    </div>
  );
}
