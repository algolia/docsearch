import React from 'react';
import type { JSX } from 'react';

import { PlusIcon } from '../icons';

interface DocsMCPActionProps {
  addDocsMCPText: string;
}

export function DocsMCPAction({
  addDocsMCPText,
}: DocsMCPActionProps): JSX.Element {
  return (
    <a
      href={`https://docsearch.algolia.com/mcp/install?utm_source=${window.location.hostname}&utm_medium=referral&utm_content=add_docs_mcp&utm_campaign=docsearch`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <PlusIcon />
      {addDocsMCPText}
    </a>
  );
}
