/* eslint-disable react/react-in-jsx-scope */
import { DocSearch, DocSearchButton, DocSearchModal } from '@docsearch/core';
import { DocSearchSidePanel, DocSearchSidePanelButton } from '@docsearch/sidepanel';
import type { JSX } from 'react';

export default function BothExample(): JSX.Element {
  return (
    <DocSearch>
      <DocSearchButton />
      <DocSearchModal />

      <DocSearchSidePanelButton />
      <DocSearchSidePanel />
    </DocSearch>
  );
}
