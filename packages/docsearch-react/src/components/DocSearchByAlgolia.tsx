import React from 'react';
import type { JSX } from 'react';

import { DocSearchMarkIcon } from '../icons';

import { AlgoliaWordMark } from './AlgoliaWordMark';

interface DocSearchByAlgoliaProps {
  byAlgoliaAriaLabel: string;
}

export function DocSearchByAlgolia({
  byAlgoliaAriaLabel,
}: DocSearchByAlgoliaProps): JSX.Element {
  return (
    <a
      href={`https://www.algolia.com/ref/docsearch/?utm_source=${window.location.hostname}&utm_medium=referral&utm_content=powered_by&utm_campaign=docsearch`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={byAlgoliaAriaLabel}
      className="DocSearch-ByAlgolia"
    >
      <DocSearchMarkIcon className="DocSearch-ByAlgolia-mark" />
      <span className="DocSearch-ByAlgolia-Lockup">
        <span className="DocSearch-ByAlgolia-Lockup-title">DOCSEARCH</span>
        <span className="DocSearch-ByAlgolia-Lockup-by">
          by <AlgoliaWordMark />
        </span>
      </span>
    </a>
  );
}
