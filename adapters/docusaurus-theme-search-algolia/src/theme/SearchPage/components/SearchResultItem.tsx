/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file
 * in the root directory of this source tree.
 */

import Link from '@docusaurus/Link';
import React, { type ReactNode } from 'react';

import styles from '../styles.module.css';
import type { SearchResultItem as SearchResultItemType } from '../types';

import { ResultIcon } from './ResultIcon';

type SearchResultItemProps = {
  item: SearchResultItemType;
  position: number;
  onSelect: (item: SearchResultItemType, position: number) => void;
};

export function SearchResultItem({
  item,
  position,
  onSelect,
}: SearchResultItemProps): ReactNode {
  return (
    <li className={styles.resultItem}>
      <Link
        to={item.url}
        className={styles.resultLink}
        onClick={() => onSelect(item, position)}
      >
        <span className={styles.resultIconWrapper}>
          <ResultIcon type={item.type} />
        </span>

        <span className={styles.resultContent}>
          {item.breadcrumbs.length > 0 && (
            <span className={styles.resultBreadcrumbs}>
              {item.breadcrumbs.map((crumb, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <React.Fragment key={index}>
                  {index > 0 && (
                    <span
                      className={styles.resultBreadcrumbSeparator}
                      aria-hidden="true"
                    >
                      ›
                    </span>
                  )}
                  {/* Highlighted HTML comes from Algolia. */}
                  {/* eslint-disable-next-line react/no-danger */}
                  <span dangerouslySetInnerHTML={{ __html: crumb }} />
                </React.Fragment>
              ))}
            </span>
          )}

          {/* Highlighted HTML comes from Algolia. */}
          {/* eslint-disable-next-line react/no-danger */}
          <span
            className={styles.resultTitle}
            dangerouslySetInnerHTML={{ __html: item.title }}
          />

          {item.summary && (
            // eslint-disable-next-line react/no-danger
            <span
              className={styles.resultSummary}
              dangerouslySetInnerHTML={{ __html: item.summary }}
            />
          )}
        </span>

        <svg
          className={styles.resultArrow}
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
            d="M7.5 4.5 13 10l-5.5 5.5"
          />
        </svg>
      </Link>
    </li>
  );
}
