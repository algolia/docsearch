/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file
 * in the root directory of this source tree.
 */

import React, { type ReactNode } from 'react';

import styles from '../styles.module.css';
import type { SearchResultItem as SearchResultItemType } from '../types';

import { SearchResultItem } from './SearchResultItem';

type SearchResultsProps = {
  items: SearchResultItemType[];
  onSelect: (item: SearchResultItemType, position: number) => void;
};

export function SearchResults({
  items,
  onSelect,
}: SearchResultsProps): ReactNode {
  return (
    <ol className={styles.resultList}>
      {items.map((item, index) => (
        <SearchResultItem
          key={item.objectID}
          item={item}
          position={index + 1}
          onSelect={onSelect}
        />
      ))}
    </ol>
  );
}
