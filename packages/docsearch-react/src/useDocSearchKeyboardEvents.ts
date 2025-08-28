import React from 'react';

import { getKeyboardShortcuts } from './constants/keyboardShortcuts';
import type { KeyboardShortcuts } from './types';

export interface UseDocSearchKeyboardEventsProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onInput?: (event: KeyboardEvent) => void;
  searchButtonRef: React.RefObject<HTMLButtonElement | null>;
  isAskAiActive: boolean;
  onAskAiToggle: (toggle: boolean) => void;
  keyboardShortcuts?: KeyboardShortcuts;
}

function isEditingContent(event: KeyboardEvent): boolean {
  const element = event.composedPath()[0] as HTMLElement;
  const tagName = element.tagName;

  return element.isContentEditable || tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA';
}

export function useDocSearchKeyboardEvents({
  isOpen,
  onOpen,
  onClose,
  onInput,
  isAskAiActive,
  onAskAiToggle,
  searchButtonRef,
  keyboardShortcuts,
}: UseDocSearchKeyboardEventsProps): void {
  const resolvedShortcuts = getKeyboardShortcuts(keyboardShortcuts);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (isOpen && event.code === 'Escape' && isAskAiActive) {
        onAskAiToggle(false);
        return;
      }

      const isCmdK =
        resolvedShortcuts['Ctrl/Cmd+K'] && event.key?.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey);
      const isSlash = resolvedShortcuts['/'] && event.key === '/';

      if (
        (event.code === 'Escape' && isOpen) ||
        // The `Cmd+K` shortcut both opens and closes the modal.
        // We need to check for `event.key` because it can be `undefined` with
        // Chrome's autofill feature.
        // See https://github.com/paperjs/paper.js/issues/1398
        isCmdK ||
        // The `/` shortcut opens but doesn't close the modal because it's
        // a character.
        (!isEditingContent(event) && isSlash && !isOpen)
      ) {
        event.preventDefault();

        if (isOpen) {
          onClose();
        } else if (!document.body.classList.contains('DocSearch--active')) {
          // We check that no other DocSearch modal is showing before opening
          // another one.
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
  }, [isOpen, onOpen, onClose, onInput, searchButtonRef, isAskAiActive, onAskAiToggle, resolvedShortcuts]);
}
