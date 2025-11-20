import type { JSX } from 'react';
import React from 'react';

import { useDocSearchKeyboardEvents } from './useDocSearchKeyboardEvents';
import { useIsMobile } from './useIsMobile';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import type { KeyboardShortcuts } from './useKeyboardShortcuts.ts';
import type { DocSearchTheme } from './useTheme';
import { useTheme } from './useTheme';

export type DocSearchState = 'modal-askai' | 'modal-search' | 'ready' | 'sidepanel';

export type View = 'modal' | 'sidepanel' | (Record<string, unknown> & string);

export type InitialAskAiMessage = {
  query: string;
  messageId?: string;
  suggestedQuestionId?: string;
};

export type OnAskAiToggle = (active: boolean, initialMessage?: InitialAskAiMessage) => void;

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
  onAskAiToggle: OnAskAiToggle;
  initialAskAiMessage: InitialAskAiMessage | undefined;
  registerView: (view: View) => void;
  isHybridModeSupported: boolean;
}

export interface DocSearchProps {
  children: Array<JSX.Element | null> | JSX.Element | React.ReactNode | null;
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
  const [initialAskAiMessage, setInitialAskAiMessage] = React.useState<InitialAskAiMessage>();
  const [registeredViews, setRegisteredViews] = React.useState(() => new Set<View>());
  const isMobile = useIsMobile();

  const isModalActive = ['modal-search', 'modal-askai'].includes(docsearchState);
  const isAskAiActive = docsearchState === 'modal-askai';
  const isHybridModeSupported = registeredViews.has('sidepanel');

  const openModal = React.useCallback((): void => {
    setDocsearchState('modal-search');
  }, []);

  const closeModal = React.useCallback((): void => {
    setDocsearchState('ready');
    searchButtonRef.current?.focus();
    setInitialQuery(props.initialQuery ?? '');
  }, [setDocsearchState, props.initialQuery]);

  const onAskAiToggle: OnAskAiToggle = React.useCallback(
    (active, initialMessage) => {
      // Don't use hybrid mode on mobile
      if (!isMobile && active && isHybridModeSupported) {
        setInitialAskAiMessage(initialMessage);
        setDocsearchState('sidepanel');
        return;
      }

      setDocsearchState(active ? 'modal-askai' : 'modal-search');
    },
    [setDocsearchState, isMobile, isHybridModeSupported],
  );

  const onInput = React.useCallback(
    (event: KeyboardEvent): void => {
      setDocsearchState('modal-search');
      setInitialQuery(event.key);
    },
    [setDocsearchState, setInitialQuery],
  );

  const registerView = React.useCallback(
    (view: View): void => {
      if (registeredViews.has(view)) return;

      setRegisteredViews((prev) => {
        const newViews = new Set(prev);
        newViews.add(view);
        return newViews;
      });
    },
    [registeredViews],
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
      initialAskAiMessage,
      registerView,
      isHybridModeSupported,
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
      initialAskAiMessage,
      registerView,
      isHybridModeSupported,
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
