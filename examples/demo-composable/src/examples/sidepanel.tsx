/* eslint-disable react/react-in-jsx-scope */
import { DocSearch } from '@docsearch/core';
import { DocSearchSidePanel, DocSearchSidePanelButton } from '@docsearch/sidepanel';
import type { JSX } from 'react';

export default function SidepanelExample(): JSX.Element {
  return (
    <DocSearch>
      <DocSearchSidePanelButton />
      <DocSearchSidePanel />
    </DocSearch>
  );
}
