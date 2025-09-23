import React from 'react';

import type { KeyboardShortcuts } from './useKeyboardShortcuts';

export interface UseDocSearchKeyboardEventsProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onInput?: (event: KeyboardEvent) => void;
  searchButtonRef: React.RefObject<HTMLButtonElement | null>;
  isAskAiActive: boolean;
  onAskAiToggle: (toggle: boolean) => void;
  keyboardShortcuts: KeyboardShortcuts;
}

function isEditingContent(event: KeyboardEvent): boolean {
  const element = event.composedPath()[0] as HTMLElement;
  const tagName = element.tagName;

  return element.isContentEditable || tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA';
}

export function useDocSearchKeyboardEvents({
  isOpen,
  isAskAiActive,
  onAskAiToggle,
  onClose,
  onOpen,
  onInput,
  searchButtonRef,
  keyboardShortcuts,
}: UseDocSearchKeyboardEventsProps): void {
  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (isOpen && event.code === 'Escape' && isAskAiActive) {
        onAskAiToggle(false);
        return;
      }

      const isCmdK =
        keyboardShortcuts['Ctrl/Cmd+K'] && event.key?.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey);
      const isSlash = keyboardShortcuts['/'] && event.key === '/';

      if ((event.code === 'Escape' && isOpen) || isCmdK || (!isEditingContent(event) && isSlash && !isOpen)) {
        event.preventDefault();

        if (isOpen) {
          onClose();
        } else if (!document.body.classList.contains('DocSearch--active')) {
          onOpen();
        }

        return;
      }

      if (searchButtonRef && searchButtonRef.current === document.activeElement && onInput) {
        if (/[a-zA-Z0-9]/.test(String.fromCharCode(event.keyCode))) {
          onInput(event);
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return (): void => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, isAskAiActive, searchButtonRef, keyboardShortcuts, onOpen, onClose, onInput, onAskAiToggle]);
}
