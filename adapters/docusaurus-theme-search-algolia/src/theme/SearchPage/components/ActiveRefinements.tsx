/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file
 * in the root directory of this source tree.
 */

import { translate } from '@docusaurus/Translate';
import React, { type ReactNode } from 'react';

import styles from '../styles.module.css';
import type { Refinements } from '../types';

type ActiveRefinementsProps = {
  refinements: Refinements;
  onRemove: (attribute: string, value: string) => void;
};

export function ActiveRefinements({
  refinements,
  onRemove,
}: ActiveRefinementsProps): ReactNode {
  const entries = Object.entries(refinements).flatMap(([attribute, values]) =>
    values.map((value) => ({ attribute, value }))
  );

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className={styles.activeRefinements}>
      {entries.map(({ attribute, value }) => (
        <button
          key={`${attribute}:${value}`}
          type="button"
          className={styles.activeRefinement}
          aria-label={translate(
            {
              id: 'theme.SearchPage.removeFilter',
              message: 'Remove filter {value}',
              description:
                'The label for the button that removes an active filter',
            },
            { value }
          )}
          onClick={() => onRemove(attribute, value)}
        >
          <span>{value}</span>
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
      ))}
    </div>
  );
}
