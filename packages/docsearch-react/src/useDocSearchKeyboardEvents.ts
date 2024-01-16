import React from 'react';

import type { DocSearchCustomShortcuts } from "./DocSearch";


export interface UseDocSearchKeyboardEventsProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onInput?: (event: KeyboardEvent) => void;
  searchButtonRef?: React.RefObject<HTMLButtonElement>;
  customShortcuts?: DocSearchCustomShortcuts[];
}

function isEditingContent(event: KeyboardEvent): boolean {
  const element = event.target as HTMLElement;
  const tagName = element.tagName;

  return (
    element.isContentEditable ||
    tagName === 'INPUT' ||
    tagName === 'SELECT' ||
    tagName === 'TEXTAREA'
  );
}

export function useDocSearchKeyboardEvents({
  isOpen,
  onOpen,
  onClose,
  onInput,
  searchButtonRef,
  customShortcuts,
}: UseDocSearchKeyboardEventsProps) {
  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      function open() {
        // We check that no other DocSearch modal is showing before opening
        // another one.
        if (!document.body.classList.contains('DocSearch--active')) {
          onOpen();
        }
      }

      //Check if a custom character is pressed
      const customKeyCharacter = customShortcuts?.find(
        (shortcut) => shortcut.key === event.key && !shortcut.withMetaOrCtrlKey
      );

      //Check if a custom character with a meta or ctrl key is pressed
      const customKeyCharacterWithMetaOrCtrl = customShortcuts?.find(
        (shortcut) =>
          shortcut.key === event.key &&
          shortcut.withMetaOrCtrlKey &&
          (event.metaKey || event.ctrlKey)
      );

      if (
        (event.keyCode === 27 && isOpen) ||
        // The `Cmd+K` shortcut both opens and closes the modal.
        // We need to check for `event.key` because it can be `undefined` with
        // Chrome's autofill feature.
        // See https://github.com/paperjs/paper.js/issues/1398
        (customShortcuts
          ? customKeyCharacterWithMetaOrCtrl
          : event.key?.toLowerCase() === 'k' &&
            (event.metaKey || event.ctrlKey)) ||
        // The `/` shortcut opens but doesn't close the modal because it's
        // a character.
        (!isEditingContent(event) &&
          (customShortcuts ? customKeyCharacter : event.key === '/') &&
          !isOpen)
      ) {
        event.preventDefault();

        if (isOpen) {
          onClose();
        } else if (!document.body.classList.contains('DocSearch--active')) {
          open();
        }
      }

      if (
        searchButtonRef &&
        searchButtonRef.current === document.activeElement &&
        onInput
      ) {
        if (/[a-zA-Z0-9]/.test(String.fromCharCode(event.keyCode))) {
          onInput(event);
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onOpen, onClose, onInput, searchButtonRef, customShortcuts]);
}
