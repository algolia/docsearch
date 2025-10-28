import type { Hit } from 'algoliasearch/lite';

export type SuggestedQuestion = {
  appId: string;
  assistantId: string;
  question: string;
  locale?: string;
  state: 'published';
  source: string;
  order: number;
};

export type SuggestedQuestionHit = Hit<SuggestedQuestion>;
