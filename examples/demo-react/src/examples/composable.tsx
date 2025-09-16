import { DocSearch, DocSearchButton, DocSearchModal } from '@docsearch/core';
import { DocSearchSidePanel, DocSearchSidePanelButton } from '@docsearch/sidepanel';
import React from 'react';

export default function Composable(): React.ReactNode {
  return (
    <DocSearch>
      <DocSearchButton />
      <DocSearchModal />

      <DocSearchSidePanelButton />
      <DocSearchSidePanel />
    </DocSearch>
  );
}
