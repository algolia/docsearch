import { useTheme } from '@docsearch/core/useTheme';
import React from 'react';

import type { DocSearchTheme } from '../types';
import { manageLocalStorageQuota } from '../utils/storage';

export function useDocSearchModalEffects({
  initialScrollY,
  modalRef,
  snippetLength,
  theme,
}: {
  initialScrollY: number;
  modalRef: React.RefObject<HTMLDivElement | null>;
  snippetLength: React.MutableRefObject<number>;
  theme?: DocSearchTheme;
}): void {
  useTheme({ theme });

  React.useEffect(() => {
    document.body.classList.add('DocSearch--active');

    return (): void => {
      document.body.classList.remove('DocSearch--active');
      window.scrollTo?.(0, initialScrollY);
    };
  }, [initialScrollY]);

  React.useEffect(() => {
    manageLocalStorageQuota();
  }, []);

  React.useLayoutEffect(() => {
    const scrollBarWidth = window.innerWidth - document.body.clientWidth;
    document.body.style.marginInlineEnd = `${scrollBarWidth}px`;

    return (): void => {
      document.body.style.marginInlineEnd = '0px';
    };
  }, []);

  React.useEffect(() => {
    if (window.matchMedia('(max-width: 768px)').matches) {
      snippetLength.current = 5;
    }
  }, [snippetLength]);

  React.useEffect(() => {
    function setFullViewportHeight(): void {
      if (modalRef.current) {
        const vh = window.innerHeight * 0.01;
        modalRef.current.style.setProperty('--docsearch-vh', `${vh}px`);
      }
    }

    setFullViewportHeight();
    window.addEventListener('resize', setFullViewportHeight);

    return (): void => {
      window.removeEventListener('resize', setFullViewportHeight);
    };
  }, [modalRef]);
}
