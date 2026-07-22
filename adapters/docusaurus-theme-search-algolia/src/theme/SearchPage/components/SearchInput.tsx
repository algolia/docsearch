/* eslint-disable jsx-a11y/no-autofocus */
/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file
 * in the root directory of this source tree.
 */

import { translate } from '@docusaurus/Translate';
import React, { type ReactNode } from 'react';

import styles from '../styles.module.css';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  autoFocus?: boolean;
};

export function SearchInput({
  value,
  onChange,
  onClear,
  autoFocus = false,
}: SearchInputProps): ReactNode {
  return (
    <div className={styles.searchBox}>
      <svg
        className={styles.searchBoxIcon}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14.386 14.386 18 18m-2-8a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"
        />
      </svg>

      <input
        autoFocus={autoFocus}
        type="search"
        name="q"
        className={styles.searchInput}
        placeholder={translate({
          id: 'theme.SearchPage.inputPlaceholder',
          message: 'Type your search here',
          description: 'The placeholder for search page input',
        })}
        aria-label={translate({
          id: 'theme.SearchPage.inputLabel',
          message: 'Search',
          description: 'The ARIA label for search page input',
        })}
        value={value}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
      />

      {value.length > 0 && (
        <button
          type="button"
          className={styles.searchBoxClear}
          aria-label={translate({
            id: 'theme.SearchPage.clearInputLabel',
            message: 'Clear the search query',
            description:
              'The label for the button that clears the search query',
          })}
          onClick={onClear}
        >
          <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              d="M5 5l10 10M15 5 5 15"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
