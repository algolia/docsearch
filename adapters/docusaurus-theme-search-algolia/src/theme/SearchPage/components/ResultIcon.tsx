/**
 * Copyright (c) Facebook, Inc. And its affiliates.
 *
 * This source code is licensed under the MIT license found in the LICENSE file
 * in the root directory of this source tree.
 */

import React, { type ReactNode } from 'react';

import styles from '../styles.module.css';

// `content` hits point at a paragraph within a page; every other type is a
// heading/section anchor.
function isContentType(type: string): boolean {
  return type === 'content';
}

export function ResultIcon({ type }: { type: string }): ReactNode {
  if (isContentType(type)) {
    return (
      <svg
        className={styles.resultIcon}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 4.5h12M4 8h12M4 11.5h8M4 15h6"
        />
      </svg>
    );
  }

  return (
    <svg
      className={styles.resultIcon}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 3.5 6 16.5M14 3.5l-1.5 13M3.5 7h13M3 13h13"
      />
    </svg>
  );
}
