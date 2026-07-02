import type { SidepanelShortcuts } from '@docsearch/core';
import { useEffect } from 'react';

type UseSidepanelKeyboardEventsProps = {
  onClose: () => void;
  onOpen: () => void;
  isOpen: boolean;
  keyboardShortcuts?: SidepanelShortcuts;
};

export function useSidepanelKeyboardEvents({
  onClose,
  onOpen,
  isOpen,
  keyboardShortcuts,
}: UseSidepanelKeyboardEventsProps): void {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent): void {
      if (isOpen && e.code === 'Escape') {
        onClose();
        return;
      }

      const cmdIEnabled = keyboardShortcuts?.['Ctrl/Cmd+I'] !== false;

      if (!cmdIEnabled) return;

      const isCmdI = e.key?.toLowerCase() === 'i' && (e.metaKey || e.ctrlKey);

      if (isCmdI) {
        e.preventDefault();

        if (isOpen) {
          onClose();
        } else {
          onOpen();
        }
      }
    }

    window.addEventListener('keydown', onKeyDown);

    return (): void => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose, onOpen, keyboardShortcuts]);
}
