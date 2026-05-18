import React, { type JSX } from 'react';

import type { AskAiScreenStateProps } from '../AskAiScreenState';
import type { InternalDocSearchHit } from '../types';

import type { RecentConversationsResultsTranslations } from './ui/RecentConversationsResults';
import { RecentConversationsResults } from './ui/RecentConversationsResults';
import type { StoredSearchesSectionsTranslations } from './ui/StoredSearchesSections';
import { StoredSearchesSections } from './ui/StoredSearchesSections';

export type AskAiStartScreenTranslations = RecentConversationsResultsTranslations & StoredSearchesSectionsTranslations;

type AskAiStartScreenProps = Omit<AskAiScreenStateProps<InternalDocSearchHit>, 'translations'> & {
  hasCollections: boolean;
  translations?: AskAiStartScreenTranslations;
};

export function AskAiStartScreen({ translations = {}, ...props }: AskAiStartScreenProps): JSX.Element | null {
  return (
    <div className="DocSearch-Dropdown-Container">
      <StoredSearchesSections {...props} translations={translations} />
      <RecentConversationsResults {...props} translations={translations} />
    </div>
  );
}
