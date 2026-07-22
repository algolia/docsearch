import React, { type JSX } from 'react';

import type { ScreenStateProps } from '../ScreenState';
import type { InternalDocSearchHit } from '../types';

import type { StoredSearchesSectionsTranslations } from './ui/StoredSearchesSections';
import { StoredSearchesSections } from './ui/StoredSearchesSections';

export type KeywordStartScreenTranslations = StoredSearchesSectionsTranslations;

type KeywordStartScreenProps = Omit<
  ScreenStateProps<InternalDocSearchHit>,
  'translations'
> & {
  hasCollections: boolean;
  translations?: KeywordStartScreenTranslations;
};

export function KeywordStartScreen({
  translations = {},
  ...props
}: KeywordStartScreenProps): JSX.Element | null {
  return (
    <div className="DocSearch-Dropdown-Container">
      <StoredSearchesSections {...props} translations={translations} />
    </div>
  );
}
