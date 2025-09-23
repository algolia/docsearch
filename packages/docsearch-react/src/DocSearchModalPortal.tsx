import { useDocSearch } from '@docsearch/core';
import React from 'react';
import { createPortal } from 'react-dom';

import type { DocSearchModalProps } from './DocSearchModal';
import { DocSearchModal } from './DocSearchModal';

export function DocSearchModalPortal(props: DocSearchModalProps): React.ReactPortal | null {
  const { docsearchState } = useDocSearch();

  if (docsearchState === 'modal-open') {
    return createPortal(<DocSearchModal {...props} />, props.portalContainer ?? document.body);
  }

  return null;
}
