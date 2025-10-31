import { useLayoutEffect, useRef } from 'react';

import type { PanelVariant } from './Sidepanel';

type UseManageSidepanelLayoutProps = {
  variant: PanelVariant;
  selectors: string;
  isOpen: boolean;
  expectedWidth: string;
};

export function useManageSidepanelLayout({
  variant,
  selectors,
  isOpen,
  expectedWidth,
}: UseManageSidepanelLayoutProps): void {
  const targetRef = useRef<HTMLElement | null>(null);
  const lastSelectorRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (variant === 'floating') return;

    if (lastSelectorRef.current !== selectors) {
      if (targetRef.current) {
        targetRef.current.style.marginRight = '';
        targetRef.current.style.transition = '';
      }

      const candidates = Array.from(document.querySelectorAll(selectors));
      const nextTarget: HTMLElement | null = (candidates[0] as HTMLElement) || document.body;
      targetRef.current = nextTarget;
      lastSelectorRef.current = selectors;

      if (targetRef.current) {
        targetRef.current.style.transition = 'margin-right 280ms cubic-bezier(0.22, 1, 0.36, 1)';
      }
    }

    const target = targetRef.current;
    if (!target) return;

    target.style.marginRight = isOpen ? expectedWidth : '0px';
  }, [isOpen, expectedWidth, variant, selectors]);

  useLayoutEffect(() => {
    return (): void => {
      if (targetRef.current) {
        targetRef.current.style.marginRight = '';
        targetRef.current.style.transition = '';
      }
    };
  }, []);
}
