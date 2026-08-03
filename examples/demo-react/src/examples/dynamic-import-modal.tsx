/* eslint-disable react/react-in-jsx-scope */
import { useDocSearchKeyboardEvents } from '@docsearch/core/useDocSearchKeyboardEvents';
import type { DocSearchAskAiModal as DocSearchAskAiModalType } from '@docsearch/react/askaiModal';
import { DocSearchButton } from '@docsearch/react/button';
import { useCallback, useRef, useState, type JSX } from 'react';
import { createPortal } from 'react-dom';

import type { DemoTheme } from '../App';
import { AGENT_ID, API_KEY, APP_ID, SEARCH_INDEX_NAME } from '../constants';

let DocSearchModal: typeof DocSearchAskAiModalType | null = null;

function importDocSearchModalIfNeeded(): Promise<void> {
  if (DocSearchModal) {
    return Promise.resolve();
  }
  // eslint-disable-next-line import/dynamic-import-chunkname
  return Promise.all([import('@docsearch/react/askaiModal')]).then(
    ([{ DocSearchAskAiModal: Modal }]) => {
      DocSearchModal = Modal;
    }
  );
}

function DocSearch({ theme }: { theme: DemoTheme }): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState<string | undefined>(
    undefined
  );
  const [isAskAiActive, setIsAskAiActive] = useState(false);
  const searchContainer = useRef<HTMLDivElement | null>(null);
  const searchButtonRef = useRef<HTMLButtonElement | null>(null);

  const prepareSearchContainer = useCallback(() => {
    if (!searchContainer.current) {
      const divElement = document.createElement('div');
      searchContainer.current = divElement;
      document.body.insertBefore(divElement, document.body.firstChild);
    }
  }, []);

  const openModal = useCallback(() => {
    prepareSearchContainer();
    importDocSearchModalIfNeeded().then(() => setIsOpen(true));
  }, [prepareSearchContainer]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    searchButtonRef.current?.focus();
    setInitialQuery(undefined);
  }, []);

  const handleInput = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'f' && (event.metaKey || event.ctrlKey)) {
        // ignore browser's ctrl+f
        return;
      }
      // prevents duplicate key insertion in the modal input
      event.preventDefault();
      setInitialQuery(event.key);
      openModal();
    },
    [openModal]
  );

  const toggleAskAi = (active: boolean): void => {
    setIsAskAiActive(active);
  };

  useDocSearchKeyboardEvents({
    isOpen,
    onOpen: openModal,
    onClose: closeModal,
    onInput: handleInput,
    searchButtonRef,
    isAskAiActive,
    onAskAiToggle: toggleAskAi,
  });

  return (
    <>
      <DocSearchButton
        ref={searchButtonRef}
        translations={{ buttonText: 'Dynamic modal search' }}
        theme={theme}
        onTouchStart={importDocSearchModalIfNeeded}
        onFocus={importDocSearchModalIfNeeded}
        onMouseOver={importDocSearchModalIfNeeded}
        onClick={openModal}
      />

      {isOpen &&
        DocSearchModal &&
        searchContainer.current &&
        createPortal(
          <DocSearchModal
            indices={[SEARCH_INDEX_NAME]}
            appId={APP_ID}
            apiKey={API_KEY}
            askAi={AGENT_ID}
            initialScrollY={window.scrollY}
            initialQuery={initialQuery}
            isAskAiActive={isAskAiActive}
            theme={theme}
            onClose={closeModal}
            onAskAiToggle={toggleAskAi}
          />,
          searchContainer.current
        )}
    </>
  );
}

export default function DynamicImportModal({
  theme,
}: {
  theme: DemoTheme;
}): JSX.Element {
  return <DocSearch theme={theme} />;
}
