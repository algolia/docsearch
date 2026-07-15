/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { translate } from '@docusaurus/Translate';
import React, { type ReactNode } from 'react';

import styles from '../styles.module.css';
import type { FacetValueItem } from '../types';

type SearchEmptyStateProps = {
  recentSearches: string[];
  onSelectRecent: (query: string) => void;
  onRemoveRecent: (query: string) => void;
  onClearRecent: () => void;
  topSections: FacetValueItem[];
  onSelectSection: (section: string) => void;
};

export function SearchEmptyState({
  recentSearches,
  onSelectRecent,
  onRemoveRecent,
  onClearRecent,
  topSections,
  onSelectSection,
}: SearchEmptyStateProps): ReactNode {
  const hasContent = recentSearches.length > 0 || topSections.length > 0;

  return (
    <div className={styles.emptyState}>
      {recentSearches.length > 0 && (
        <section className={styles.emptySection}>
          <div className={styles.emptySectionHeader}>
            <h2 className={styles.emptySectionTitle}>
              {translate({
                id: 'theme.SearchPage.recentSearches',
                message: 'Recent searches',
                description: 'The heading for the list of recent searches',
              })}
            </h2>
            <button type="button" className={styles.emptySectionAction} onClick={onClearRecent}>
              {translate({
                id: 'theme.SearchPage.clearRecentSearches',
                message: 'Clear',
                description: 'The label for the button that clears recent searches',
              })}
            </button>
          </div>

          <ul className={styles.recentList}>
            {recentSearches.map((query) => (
              <li key={query} className={styles.recentItem}>
                <button type="button" className={styles.recentButton} onClick={() => onSelectRecent(query)}>
                  <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true">
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10 5.5V10l3 2m4-2a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                    />
                  </svg>
                  <span>{query}</span>
                </button>
                <button
                  type="button"
                  className={styles.recentRemove}
                  aria-label={translate(
                    {
                      id: 'theme.SearchPage.removeRecentSearch',
                      message: 'Remove "{query}" from history',
                      description: 'The label for the button that removes a recent search',
                    },
                    { query },
                  )}
                  onClick={() => onRemoveRecent(query)}
                >
                  <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      d="M5 5l10 10M15 5 5 15"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {topSections.length > 0 && (
        <section className={styles.emptySection}>
          <h2 className={styles.emptySectionTitle}>
            {translate({
              id: 'theme.SearchPage.browseSections',
              message: 'Browse by section',
              description: 'The heading for the list of documentation sections to browse',
            })}
          </h2>
          <div className={styles.sectionChips}>
            {topSections.map((section) => (
              <button
                key={section.name}
                type="button"
                className={styles.sectionChip}
                onClick={() => onSelectSection(section.name)}
              >
                <span>{section.name}</span>
                <span className={styles.sectionChipCount}>{section.count}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {!hasContent && (
        <p className={styles.emptyHint}>
          {translate({
            id: 'theme.SearchPage.emptyHint',
            message: 'Start typing to search the documentation.',
            description: 'The hint shown on the search page before the user types anything',
          })}
        </p>
      )}
    </div>
  );
}
