/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file
 * in the root directory of this source tree.
 */

import { translate } from '@docusaurus/Translate';
import clsx from 'clsx';
import React, { type ReactNode } from 'react';

import styles from '../styles.module.css';

export function SearchResultsSkeleton({
  count = 5,
}: {
  count?: number;
}): ReactNode {
  return (
    <div
      className={styles.skeletonList}
      aria-busy="true"
      aria-label={translate({
        id: 'theme.SearchPage.loadingResults',
        message: 'Loading search results',
        description:
          'The ARIA label announced while search results are loading',
      })}
    >
      {Array.from({ length: count }).map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={index} className={styles.skeletonItem}>
          <div className={styles.skeletonIcon} />
          <div className={styles.skeletonBody}>
            <div
              className={clsx(styles.skeletonLine, styles.skeletonLineShort)}
            />
            <div
              className={clsx(styles.skeletonLine, styles.skeletonLineTitle)}
            />
            <div
              className={clsx(styles.skeletonLine, styles.skeletonLineWide)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
