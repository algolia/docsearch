import React, { type JSX } from 'react';

export type GeneratingSummaryTranslations = Partial<{
  generatingSummaryTitle: string;
  generatingSummaryDescription: string;
}>;

interface GeneratingSummaryProps {
  translations?: GeneratingSummaryTranslations;
}

export function GeneratingSummaryScreen({ translations = {} }: GeneratingSummaryProps): JSX.Element {
  const {
    generatingSummaryTitle = 'Generating summary...',
    generatingSummaryDescription = 'We are generating a summary of your conversation. This may take a few seconds.',
  } = translations;

  return (
    <div className="DocSearch-GeneratingSummaryScreen">
      <h3 className="DocSearch-GeneratingSummaryScreen-Title">{generatingSummaryTitle}</h3>
      <p className="DocSearch-GeneratingSummaryScreen-Description shimmer">{generatingSummaryDescription}</p>
    </div>
  );
}
