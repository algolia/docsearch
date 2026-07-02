import { useLayoutEffect, useRef } from 'react';

import { useIsMobile } from '../useIsMobile';

import type { PanelSide, PanelVariant } from './types';

type UseManageSidepanelLayoutProps = {
  variant: PanelVariant;
  side: PanelSide;
  selectors: string;
  isOpen: boolean;
  expectedWidth: string;
};

export function useManageSidepanelLayout({
  variant,
  selectors,
  isOpen,
  expectedWidth,
  side,
}: UseManageSidepanelLayoutProps): void {
  const targetRef = useRef<HTMLElement | null>(null);
  const lastSelectorRef = useRef<string | null>(null);
  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    if (variant === 'floating' || isMobile) return;

    if (lastSelectorRef.current !== selectors) {
      if (targetRef.current) {
        if (side === 'left') {
          targetRef.current.style.marginLeft = '';
        } else {
          targetRef.current.style.marginRight = '';
        }
        targetRef.current.style.transition = '';
      }

      const candidates = Array.from(document.querySelectorAll(selectors));
      const nextTarget: HTMLElement | null = (candidates[0] as HTMLElement) || document.body;
      targetRef.current = nextTarget;
      lastSelectorRef.current = selectors;

      if (targetRef.current) {
        targetRef.current.style.transition = `margin-${side} 280ms cubic-bezier(0.22, 1, 0.36, 1)`;
      }
    }

    const target = targetRef.current;
    if (!target) return;

    const offset = isOpen ? expectedWidth : '0px';

    if (side === 'left') {
      target.style.marginLeft = offset;
    } else {
      target.style.marginRight = offset;
    }
  }, [isOpen, expectedWidth, variant, selectors, side, isMobile]);

  useLayoutEffect(() => {
    return (): void => {
      if (targetRef.current) {
        if (side === 'left') {
          targetRef.current.style.marginLeft = '';
        } else {
          targetRef.current.style.marginRight = '';
        }
        targetRef.current.style.transition = '';
      }
    };
  }, [side]);
}
