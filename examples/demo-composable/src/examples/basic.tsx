/* eslint-disable react/react-in-jsx-scope */
import { DocSearch, DocSearchButton, DocSearchModal } from '@docsearch/core';
import type { JSX } from 'react';

export default function Basic(): JSX.Element {
  return (
    <DocSearch>
      <DocSearchButton />
      <DocSearchModal />
    </DocSearch>
  );
}
