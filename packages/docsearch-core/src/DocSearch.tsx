import type { JSX } from 'react';
import React from 'react';

import { useDocSearchKeyboardEvents } from './useDocSearchKeyboardEvents';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import type { KeyboardShortcuts } from './useKeyboardShortcuts.ts';
import type { DocSearchTheme } from './useTheme';
import { useTheme } from './useTheme';

type DocSearchState = 'modal-open' | 'ready';

interface IDocSearchContext {
  apiKey: string;
  appId: string;
  indexName?: string;
  docsearchState: DocSearchState;
  setDocsearchState: (newState: DocSearchState) => void;
  searchButtonRef: React.RefObject<HTMLButtonElement | null>;
  initialQuery?: string;
  keyboardShortcuts: Required<KeyboardShortcuts>;
}

export interface DocSearchProps {
  appId: string;
  apiKey: string;
  indexName?: string;
  children: JSX.Element | JSX.Element[];
  theme?: DocSearchTheme;
  initialQuery?: string;
  keyboardShortcuts?: KeyboardShortcuts;
}

const DocSearchContext = React.createContext<IDocSearchContext | undefined>(undefined);

export function DocSearch({ appId, apiKey, indexName, children, theme, ...props }: DocSearchProps): JSX.Element {
  const [docsearchState, setDocsearchState] = React.useState<DocSearchState>('ready');
  const [initialQuery, setInitialQuery] = React.useState<string | undefined>(props.initialQuery || undefined);
  const [askAiActive, setAskAiActive] = React.useState(false);
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);
  const keyboardShortcuts = useKeyboardShortcuts(props.keyboardShortcuts);

  const onOpen = (): void => {
    setDocsearchState('modal-open');
  };

  const onClose = React.useCallback((): void => {
    setDocsearchState('ready');
    setInitialQuery(props.initialQuery);
    if (askAiActive) {
      setAskAiActive(false);
    }
  }, [askAiActive, setAskAiActive, setDocsearchState, props.initialQuery]);

  const onAskAiToggle = React.useCallback(
    (active: boolean): void => {
      setAskAiActive(active);
    },
    [setAskAiActive],
  );

  const onInput = React.useCallback(
    (event: KeyboardEvent): void => {
      setDocsearchState('modal-open');
      setInitialQuery(event.key);
    },
    [setDocsearchState, setInitialQuery],
  );

  useTheme({ theme });

  useDocSearchKeyboardEvents({
    isOpen: docsearchState === 'modal-open',
    onOpen,
    onClose,
    onAskAiToggle,
    onInput,
    isAskAiActive: askAiActive,
    searchButtonRef,
    keyboardShortcuts,
  });

  const value: IDocSearchContext = React.useMemo(
    () => ({
      docsearchState,
      setDocsearchState,
      apiKey,
      appId,
      indexName,
      searchButtonRef,
      initialQuery,
      keyboardShortcuts,
    }),
    [docsearchState, apiKey, appId, indexName, searchButtonRef, initialQuery, keyboardShortcuts],
  );

  return <DocSearchContext.Provider value={value}>{children}</DocSearchContext.Provider>;
}

export function useDocSearch(): IDocSearchContext {
  const ctx = React.useContext(DocSearchContext);

  if (ctx === undefined) {
    throw new Error('`useDocSearch` must be used within the `DocSearch` provider');
  }

  return ctx;
}
