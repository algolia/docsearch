import type { JSX } from 'react';
import React from 'react';

import { useDocSearchKeyboardEvents } from './useDocSearchKeyboardEvents';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import type { KeyboardShortcuts } from './useKeyboardShortcuts.ts';
import type { DocSearchTheme } from './useTheme';
import { useTheme } from './useTheme';

export type DocSearchState = 'modal-askai' | 'modal-search' | 'ready';

export interface DocSearchContext {
  docsearchState: DocSearchState;
  setDocsearchState: (newState: DocSearchState) => void;
  searchButtonRef: React.RefObject<HTMLButtonElement | null>;
  initialQuery: string;
  keyboardShortcuts: Required<KeyboardShortcuts>;
  openModal: () => void;
  closeModal: () => void;
  isAskAiActive: boolean;
  isModalActive: boolean;
  onAskAiToggle: (active: boolean) => void;
}

export interface DocSearchProps {
  children: Array<JSX.Element | null> | JSX.Element | null;
  theme?: DocSearchTheme;
  initialQuery?: string;
  keyboardShortcuts?: KeyboardShortcuts;
}

const Context = React.createContext<DocSearchContext | undefined>(undefined);
Context.displayName = 'DocSearchContext';

export function DocSearch({ children, theme, ...props }: DocSearchProps): JSX.Element {
  const [docsearchState, setDocsearchState] = React.useState<DocSearchState>('ready');
  const [initialQuery, setInitialQuery] = React.useState<string>(props.initialQuery || '');
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);
  const keyboardShortcuts = useKeyboardShortcuts(props.keyboardShortcuts);

  const isModalActive = ['modal-search', 'modal-askai'].includes(docsearchState);
  const isAskAiActive = docsearchState === 'modal-askai';

  const openModal = React.useCallback((): void => {
    setDocsearchState('modal-search');
  }, []);

  const closeModal = React.useCallback((): void => {
    setDocsearchState('ready');
    searchButtonRef.current?.focus();
    setInitialQuery(props.initialQuery ?? '');
  }, [setDocsearchState, props.initialQuery]);

  const onAskAiToggle = React.useCallback(
    (active: boolean): void => {
      setDocsearchState(active ? 'modal-askai' : 'modal-search');
    },
    [setDocsearchState],
  );

  const onInput = React.useCallback(
    (event: KeyboardEvent): void => {
      setDocsearchState('modal-search');
      setInitialQuery(event.key);
    },
    [setDocsearchState, setInitialQuery],
  );

  useTheme({ theme });

  useDocSearchKeyboardEvents({
    isOpen: isModalActive,
    onOpen: openModal,
    onClose: closeModal,
    onAskAiToggle,
    onInput,
    isAskAiActive,
    searchButtonRef,
    keyboardShortcuts,
  });

  const value: DocSearchContext = React.useMemo(
    () => ({
      docsearchState,
      setDocsearchState,
      searchButtonRef,
      initialQuery,
      keyboardShortcuts,
      openModal,
      closeModal,
      isAskAiActive,
      isModalActive,
      onAskAiToggle,
    }),
    [
      docsearchState,
      searchButtonRef,
      initialQuery,
      keyboardShortcuts,
      openModal,
      closeModal,
      isAskAiActive,
      isModalActive,
      onAskAiToggle,
    ],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}
DocSearch.displayName = 'DocSearch';

export function useDocSearch(): DocSearchContext {
  const ctx = React.useContext(Context);

  if (ctx === undefined) {
    throw new Error('`useDocSearch` must be used within the `DocSearch` provider');
  }

  return ctx;
}
